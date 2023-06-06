require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const db = require('../db/subscriptions.js');
const db_owners = require('../db/owners');
const db_restaurant = require('../db/restaurants');
const email = require('../services/emails');

exports.getActualSubscription = async (req, res, next) => {
    var restaurant = req.body.restaurant;
    try {
        var subs = await db.getActualSubscription(restaurant);
        
        if (subs.length == 1) {
            var response = [];
            subs.forEach(sub => {
                res_sub = {
                    id: sub.id,
                    resto_id: sub.resto_id,
                    table_amount: sub.table_amount,
                    price: sub.price,
                    start_time: sub.start_time,
                    end_time: sub.end_time
                }
                response.push(res_sub);
            });
            res.status(200).json({ message: "success", data: response });
        }
        else{
            res.status(404).json({ message: "error, no subscription found" });
        }
    } catch (error) {
        res.status(500).json({message: "error, cannot check subscription"});
    }
}

exports.createSubscription = async (req, res, next) => {
    try {
        var owner_data = await db_owners.getOwner(req.auth.userId);
        var resto_data = await db_restaurant.getRestaurants(req.body.restaurant);
        var owner_id = req.auth.userId;
        var resto_id = req.body.restaurant;
        var table_amount = req.body.table_amount;
        var start_time = Math.floor(Date.now()/ 1000);
        var end_time = start_time + 3600*24*30;
        var price = 2*table_amount;
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: owner_data.stripe_id,
            subscription_data: {
                description: resto_data.name,
            },
            line_items: [
            {
                price: "price_1LNt6GDeZJMTrhVum5zHsXvd", //REPLACE LATER BY ENV VARIABLE (subscription product price id)
                quantity: table_amount,
            },
            ],
            success_url: 'https://ieumy.com/owners/subscription/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://ieumy.com/owners/subscription/canceled',
        });
        var checkout_stripe_id = session.id;
        var subscription = {
            owner_id,
            resto_id,
            table_amount,
            start_time,
            end_time,
            price,
            checkout_stripe_id
        }
        await db.createSubscription(subscription);
        res.status(200).json({message: "success", data: {url: session.url}});
    } catch (error) {
        res.status(500).json({message: "cannot create subscription"});
    }
    

}

exports.getPortalLinkSubscription = async (req, res, next) => {
    try {
        const configuration = await stripe.billingPortal.configurations.create({
            features: {
              customer_update: {
                allowed_updates: ['tax_id'],
                enabled: true,
              },
              invoice_history: {enabled: true},
              payment_method_update: {enabled: true},
              subscription_cancel: {enabled: true},
              
            },
            business_profile: {
              privacy_policy_url: 'https://ieumy.com/privacy',
              terms_of_service_url: 'https://ieumy.com/terms',
            },
        });
        var owner_data = await db_owners.getOwner(req.auth.userId);
        const customer_id = owner_data.stripe_id;
        const session = await stripe.billingPortal.sessions.create({
            customer: customer_id,
            return_url: 'https://ieumy.com/owners',
            configuration: configuration.id,
        });
        res.status(200).json({message: "success", data: {url: session.url}});
    } catch (error) {
        res.status(500).json({message: "cannot create subscription portal link"});
    }
    
}

exports.updateSubscription = async (req, res, next) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = process.env.STRIPE_WEBHOOKS_SUBSCRIPTION;
    if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];

        try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );
        } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
        }
        // Extract the object from the event.
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    switch (eventType) {
        case 'checkout.session.completed':
            // Payment is successful and the subscription is created.
            // You should provision the subscription and save the customer ID to your database.
            try {
                var subscription = {};
                subscription.checkout_stripe_id = data.object.id;
                subscription.sub_stripe_id = data.object.subscription;
                await db.updateSubscriptionToPayed(subscription);
                var subscription_data = await db.getSubscriptionsBySubID(data.object.subscription);
                const subscription_stripe_data = await stripe.subscriptions.retrieve(subscription_data[0].sub_stripe_id);
                var owner_data = await db_owners.getOwner(subscription_data[0].owner_id);
                await email.SendConfirmSubscription(owner_data.email, owner_data.firstname, subscription_stripe_data.description, subscription_stripe_data.items.data[0].quantity);
            } catch (error) {
                throw new Error(error);
            }
            break;
        case 'invoice.paid':
            // Continue to provision the subscription as payments continue to be made.
            // Store the status in your database and check when a user accesses your service.
            // This approach helps you avoid hitting rate limits.
            try {
                var subscriptions = await db.getSubscriptionsBySubID(data.object.subscription);
                var new_sub_info = {};
                var last_end_time = 0;
                subscriptions.forEach(subscription => {
                    if (subscription.end_time > last_end_time) {
                        new_sub_info = subscription;
                        new_sub_info.checkout_stripe_id = null;
                    }
                });
                if (new_sub_info.end_time < Math.floor(Date.now()/ 1000) + 3600*24*7*3) { //IF ACTUAL SUB IS STILL VALID FOR AT LEAST 3 WEEKS (SUB JUST CREATED)
                    new_sub_info.start_time = Math.floor(Date.now()/ 1000);
                    new_sub_info.end_time = new_sub_info.start_time + 3600*24*30;
                    await db.renewSubscription(new_sub_info);
                    var owner_data = await db_owners.getOwner(new_sub_info.owner_id);
                    var resto_data = await db_restaurant.getRestaurants(new_sub_info.resto_id);
                    await email.SendConfirmRenewal(owner_data.email, owner_data.firstname, resto_data.name);
                }
            } catch (error) {
                throw new Error(error);
            }
            
            break;
        case 'invoice.payment_failed':
            // The payment failed or the customer does not have a valid payment method.
            // The subscription becomes past_due. Notify your customer and send them to the
            // customer portal to update their payment information.
            try {
                console.log("invoice payment failed");
                await email.SendFailedPaymentSubscription(data.object.customer_email, data.object.customer_name);
            } catch (error) {
                throw new Error(error);
            }
            break;
        default:
        // Unhandled event type
        }

    res.sendStatus(200);
}