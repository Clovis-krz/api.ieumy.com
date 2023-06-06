const db = require('./client.js');

async function createSubscription(subscription){
    const query = {
        text: 'INSERT INTO subscriptions(resto_id, owner_id, table_amount, price, start_time, end_time, status, checkout_stripe_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        values: [subscription.resto_id, subscription.owner_id, subscription.table_amount, subscription.price, subscription.start_time, subscription.end_time, "pending", subscription.checkout_stripe_id],
    }
    try{
        await db.client.query(query);
    }catch (err){
        throw new Error(err);
    }
}

async function updateSubscriptionToPayed(subscription){
    const query = {
        text: 'UPDATE subscriptions SET (status, sub_stripe_id) = ($1,$2) WHERE checkout_stripe_id = $3',
        values: ["payed", subscription.sub_stripe_id, subscription.checkout_stripe_id],
    }
    try{
        await db.client.query(query);
    }catch (err){
        throw new Error(err);
    }
}

async function renewSubscription(subscription){
    const query = {
        text: 'INSERT INTO subscriptions(resto_id, owner_id, table_amount, price, start_time, end_time, status, sub_stripe_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        values: [subscription.resto_id, subscription.owner_id, subscription.table_amount, subscription.price, subscription.start_time, subscription.end_time, "payed", subscription.sub_stripe_id],
    }
    try{
        await db.client.query(query);
    }catch (err){
        throw new Error(err);
    }
}

async function getActualSubscription(restaurant_id){
    var time_now = Math.floor(Date.now()/ 1000);
    const query = {
        text: 'SELECT * from subscriptions WHERE resto_id = $1 AND end_time > $2 AND status = $3',
        values: [restaurant_id, time_now, "payed"],
    }
    try{
        var res = await db.client.query(query);
        return res.rows;
    }catch{
        throw new Error("impossible to get subscription");
    }
}

async function getActualSubscriptionByOwner(owner_id){
    var time_now = Math.floor(Date.now()/ 1000);
    const query = {
        text: 'SELECT * from subscriptions WHERE owner_id = $1 AND end_time > $2 AND status = $3',
        values: [owner_id, time_now, "payed"],
    }
    try{
        var res = await db.client.query(query);
        return res.rows;
    }catch{
        throw new Error("impossible to get subscription by owner");
    }
}

async function getSubscriptionsBySubID(sub_id){
    var time_now = Math.floor(Date.now()/ 1000);
    const query = {
        text: 'SELECT * from subscriptions WHERE sub_stripe_id = $1',
        values: [sub_id],
    }
    try{
        var res = await db.client.query(query);
        return res.rows;
    }catch{
        throw new Error("impossible to get subscription");
    }
}

module.exports = {
    createSubscription,
    getActualSubscription,
    getActualSubscriptionByOwner,
    updateSubscriptionToPayed,
    renewSubscription,
    getSubscriptionsBySubID,
}