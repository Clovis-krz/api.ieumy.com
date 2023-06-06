const db = require('./client.js');

async function createCustomer(customer){
    const query = {
        text: 'INSERT INTO customers(lastname, firstname, email, password, address) VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [customer.lastname, customer.firstname, customer.email, customer.hash, customer.address],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error("impossible to register customer");
    }
}

async function updateCustomer(customer){
    const query = {
        text: 'UPDATE customers SET (lastname, firstname, address) = ($1, $2, $3) WHERE id=$4',
        values: [customer.lastname, customer.firstname, customer.address, customer.userId],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error("impossible to update customer");
    }
}

async function updateEmailCustomer(customer){
    const query = {
        text: 'UPDATE customers SET email = $1 WHERE id=$2',
        values: [customer.email, customer.userId],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error(err);
    }
}

async function updatePasswordCustomer(customer){
    const query = {
        text: 'UPDATE customers SET password = $1 WHERE id=$2',
        values: [customer.password, customer.userId],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error("impossible to update customer password");
    }
}

async function deleteCustomer(customer){
    const query = {
        text: 'DELETE FROM customers WHERE id=$1',
        values: [customer.userId],
    }
    try{
        await db.client.query(query);
    }catch (err){
        throw new Error("impossible to delete customer");
    }
}

async function loginCustomer(email){
    const query = {
        text: 'SELECT * FROM customers WHERE email=$1',
        values: [email],
    }
    try{
        var res = await db.client.query(query);
        return res.rows[0];
    }catch (err){
        throw new Error("impossible to get customer");
    }
}

async function getCustomer(id){
    const query = {
        text: 'SELECT * FROM customers WHERE id=$1',
        values: [id],
    }
    try{
        var res = await db.client.query(query);
        return res.rows[0];
    }catch (err){
        throw new Error("impossible to get customer");
    }
}

async function getPasswordHashCustomers(email){
    const query = {
        text: 'SELECT password FROM customers WHERE email=$1',
        values: [email],
    }
    try{
        var res = await db.client.query(query);
        return res.rows[0].password;
    }catch (err){
        throw new Error("impossible to get password hash from customers");
    }
}

module.exports ={
    createCustomer,
    updateCustomer,
    updateEmailCustomer,
    updatePasswordCustomer,
    deleteCustomer,
    loginCustomer,
    getCustomer,
    getPasswordHashCustomers,
}