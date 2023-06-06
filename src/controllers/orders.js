require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const db = require('../db/orders.js');
const db_resto = require('../db/restaurants.js');
const email = require('../services/emails');

exports.createOrder = async (req, res, next) => {
  var order = req.body;
  var total_order = req.cart_total;
  var data = order.items;
  order.items = {
    data
  }
  try{
    var resto_data = await db_resto.getRestaurants(order.resto_id);
    var session_data = {
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Number(total_order)*100,
            product_data: {
              name: "Cart",
            },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://ieumy.com/success',
      cancel_url: 'https://ieumy.com/cancel',
      expires_at: expire_payment_time,
      payment_intent_data: {
        application_fee_amount: 0,
      },
    };
    order.user_id = req.auth.userId;
    session_data.customer_email = order.email;
    var time = Math.floor(Date.now()/ 1000);
    var expire_payment_time = time + 3600;
    const session = await stripe.checkout.sessions.create(session_data, {
      stripeAccount: resto_data.stripe_account,
    });
    order.start_time = time;
    order.end_time = null;
    order.status = "pending";
    order.price = total_order;
    order.stripe_id = session.id;
    var result = await db.createOrder(order);
    res.status(200).json({
      data: result.rows[0],
      url: session.url,
    })
  }catch (err){
    res.status(500).json({
      message: "cannot create order",
    })
  }
};

exports.monitorPaymentStatus = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const body = req.body;
  let event = null;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOKS_ORDER);
  } catch (err) {
    // invalid signature
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let session = null;
  switch (event['type']) {
    case 'checkout.session.completed':
      session = event.data.object;
      try {
        await db.confirmOrderPayment(session.id);
        const order_data = await db.getMyOrderByStripeID(session.id);
        const resto_data = await db_resto.getRestaurants(order_data.resto_id);
        await email.SendConfirmOrder(order_data.id, order_data.email, order_data.lastname, order_data.firstname, resto_data.name, order_data.items.data, order_data.price);
        break;
      } catch (error) {
        console.log(error);
        return;
      }
    case 'checkout.session.expired':
      session = event.data.object;
      try {
        await db.OrderPaymentFailed(session.id);
        break;
      } catch (error) {
        console.log(error);
        return;
      } 
  }
  res.json({received: true});
}

exports.getOrders = async (req, res, next) => {
  var order = req.body;
  try{
    var result = await db.getOrders(order.restaurant);
    res.status(200).json({
      data: result,
    })
  }catch (err){
    res.status(500).json({
      message: "cannot get orders",
    })
  }
};

exports.getMyOrder = async (req, res, next) => {
  var order = req.body;
  try{
    var result = await db.getMyOrder(order);
    delete result.firstname;
    delete result.lastname;
    delete result.user_id;
    delete result.table_nb;
    res.status(200).json({
      data: result,
    })
  }catch (err){
    res.status(500).json({
      message: "cannot get my order",
    })
  }
};

exports.getPayedOrders = async (req, res, next) => {
  var order = req.body;
  try{
    var result = await db.getPayedOrders(order.restaurant);
    res.status(200).json({
      data: result,
    })
  }catch (err){
    res.status(500).json({
      message: "cannot get payed orders",
    })
  }
};

exports.OrderIsPayed = async (req, res, next) => {
    var order = req.body;
    try{
        order.id = order.order_id;
        order.end_time = null;
        order.status = "payed";
        await db.updateOrder(order);
        res.status(200).json({
            message: "success",
        })
    }catch (err){
      res.status(500).json({
        message: "cannot update order to payed",
      })
    }
};

exports.OrderIsServed = async (req, res, next) => {
    var order = req.body;
    try{
        order.id = order.order_id;
        order.end_time = Math.floor(Date.now()/ 1000);
        order.status = "served";
        await db.updateOrder(order);
        res.status(200).json({
            message: "success",
        })
    }catch (err){
      res.status(500).json({
        message: "cannot update order to served",
      })
    }
};

exports.OrderIsCancelled = async (req, res, next) => {
  var order = req.body;
  try{
      order.id = order.order_id;
      const order_data = await db.getMyOrder(order);
      const resto_data = await db_resto.getRestaurants(order_data.resto_id);
      const session = await stripe.checkout.sessions.retrieve(order_data.stripe_id, {"stripeAccount": resto_data.stripe_account });
      const refund = await stripe.refunds.create({
      payment_intent: session.payment_intent,},{ stripeAccount: resto_data.stripe_account,});
      order.end_time = Math.floor(Date.now()/ 1000);
      order.status = "cancelled";
      await db.updateOrder(order);
      await email.SendCancelledOrder(order_data.id, order_data.email, order_data.firstname, resto_data.name, order_data.price);
      res.status(200).json({
          message: "success",
      })
  }catch (err){
    res.status(500).json({
      message: "cannot update order to cancelled",
    })
  }
};

