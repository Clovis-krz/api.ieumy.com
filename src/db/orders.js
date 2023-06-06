const db = require('./client.js');

async function createOrder(order){
    const query = {
        text: 'INSERT INTO orders(lastname, firstname, user_id, items, price, start_time, end_time, status, resto_id, table_nb, stripe_id, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
        values: [order.lastname, order.firstname, order.user_id, order.items, order.price, order.start_time, order.end_time, order.status, order.resto_id, order.table_nb, order.stripe_id, order.email],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        console.log(err);
        throw new Error("impossible to create order");
    }
}

async function getOrders(resto_id){
    const query = {
        text: 'SELECT * FROM orders WHERE resto_id = $1 AND status = $2 OR status = $3 OR status = $4',
        values: [resto_id, "payed", "served", "cancelled"],
    }
    try{
        result = await db.client.query(query);
        return result.rows;
    }catch (err){
        console.log(err);
        throw new Error("impossible to get orders");
    }
}

async function getMyOrder(order){
    const query = {
        text: 'SELECT * FROM orders WHERE id = $1 AND resto_id = $2',
        values: [order.id, order.restaurant],
    }
    try{
        result = await db.client.query(query);
        return result.rows[0];
    }catch (err){
        console.log(err);
        throw new Error("impossible to get order");
    }
}

async function getMyOrderByStripeID(stripe_id){
    const query = {
        text: 'SELECT * FROM orders WHERE stripe_id = $1',
        values: [stripe_id],
    }
    try{
        result = await db.client.query(query);
        return result.rows[0];
    }catch (err){
        console.log(err);
        throw new Error("impossible to get order from stripe_id");
    }
}

async function getPayedOrders(resto_id){
    const query = {
        text: 'SELECT * FROM orders WHERE resto_id = $1 AND status = $2',
        values: [resto_id, "payed"],
    }
    try{
        result = await db.client.query(query);
        return result.rows;
    }catch (err){
        console.log(err);
        throw new Error("impossible to get payed orders");
    }
}

async function getOrderEndTime(order){
    const query = {
        text: 'SELECT end_time FROM orders WHERE id = $1 AND resto_id = $2',
        values: [order.id, order.restaurant],
    }
    try{
        result = await db.client.query(query);
        return result.rows[0];
    }catch (err){
        console.log(err);
        throw new Error("impossible to get order end_time");
    }
}

async function updateOrder(order){
    const query = {
        text: 'UPDATE orders SET (status, end_time) = ($1, $2) WHERE id = $3',
        values: [order.status, order.end_time, order.id],
    }
    try{
        await db.client.query(query);
    }catch (err){
        console.log(err);
        throw new Error("impossible to update order");
    }
}

async function confirmOrderPayment(payment_intent_id){
    const query = {
        text: 'UPDATE orders SET status = $1 WHERE stripe_id = $2',
        values: ["payed", payment_intent_id],
    }
    try{
        await db.client.query(query);
    }catch (err){
        console.log(err);
        throw new Error("impossible to confirm order payment");
    }
}

async function OrderPaymentFailed(payment_intent_id){
    const query = {
        text: 'DELETE FROM orders WHERE stripe_id = $1',
        values: [payment_intent_id],
    }
    try{
        await db.client.query(query);
    }catch (err){
        console.log(err);
        throw new Error("impossible to delete order");
    }
}

async function deleteOrders(order){
    const query = {
        text: 'DELETE FROM orders WHERE resto_id = $1',
        values: [order.restaurant],
    }
    try{
        await db.client.query(query);
    }catch (err){
        console.log(err);
        throw new Error("impossible to delete orders");
    }
}

module.exports = {
    createOrder,
    getOrders,
    getMyOrder,
    getMyOrderByStripeID,
    getPayedOrders,
    getOrderEndTime,
    updateOrder,
    confirmOrderPayment,
    OrderPaymentFailed,
    deleteOrders,
}