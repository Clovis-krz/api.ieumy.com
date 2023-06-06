const db = require('./client.js');

async function createOwner(owner){
    const query = {
        text: 'INSERT INTO owners(lastname, firstname, email, password, stripe_id) VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [owner.lastname, owner.firstname, owner.email, owner.hash, owner.stripe_id],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error(err);
    }
}

async function updateOwner(owner){
    const query = {
        text: 'UPDATE owners SET (lastname, firstname) = ($1, $2) WHERE id=$3',
        values: [owner.lastname, owner.firstname, owner.userId],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error("impossible to update owner");
    }
}

async function updateOwnerPassword(owner){
    const query = {
        text: 'UPDATE owners SET password = $1 WHERE id=$2',
        values: [owner.password, owner.userId],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error("impossible to update owner password");
    }
}

async function updateOwnerEmail(owner){
    const query = {
        text: 'UPDATE owners SET email = $1 WHERE id=$2',
        values: [owner.email, owner.userId],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error("impossible to update owner email");
    }
}

async function deleteOwner(owner){
    const query = {
        text: 'DELETE FROM owners WHERE id=$1',
        values: [owner.userId],
    }
    try{
        await db.client.query(query);
    }catch (err){
        throw new Error("impossible to delete owner");
    }
}

async function loginOwner(email){
    const query = {
        text: 'SELECT * FROM owners WHERE email=$1',
        values: [email],
    }
    try{
        var res = await db.client.query(query);
        return res.rows[0];
    }catch (err){
        throw new Error("impossible to get owner");
    }
}

async function getOwner(id){
    const query = {
        text: 'SELECT * FROM owners WHERE id=$1',
        values: [id],
    }
    try{
        var res = await db.client.query(query);
        return res.rows[0];
    }catch (err){
        throw new Error("impossible to get owner");
    }
}

async function attachRestaurant(owner_id, resto_id){
    const query = {
        text: 'UPDATE owners SET restaurant=$1 WHERE id=$2',
        values: [resto_id, owner_id],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch (err){
        throw new Error("impossible to register owner");
    }
}

async function getPasswordHashOwners(email){
    const query = {
        text: 'SELECT password FROM owners WHERE email=$1',
        values: [email],
    }
    try{
        var res = await db.client.query(query);
        return res.rows[0].password;
    }catch (err){
        throw new Error("impossible to get password hash from owner");
    }
}

module.exports ={
    createOwner,
    updateOwner,
    updateOwnerPassword,
    updateOwnerEmail,
    deleteOwner,
    loginOwner,
    getOwner,
    attachRestaurant,
    getPasswordHashOwners,
}