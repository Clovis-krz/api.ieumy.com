const db = require('./client.js');

async function getRestaurants(id) {
    const query = {
        text: 'SELECT * FROM restaurants WHERE id=$1',
        values: [id],
    }
    try{
        var resto = await db.client.query(query);
        if (!resto.rows[0]) {
            throw new Error("not found");
        }else{
            return resto.rows[0];
        }
    }catch (err){
        throw new Error("Cannot connect to database");
    }
    
}

async function createRestaurants(restaurant){
    const query = {
        text: 'INSERT INTO restaurants(name, description, image, categories, stripe_account) VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [restaurant.name, restaurant.description, restaurant.image, '{}', restaurant.stripe_account],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch{
        throw new Error("impossible to register restaurant");
    }
}

async function updateRestaurants(resto_id, restaurant){
    const query = {
        text: 'UPDATE restaurants SET (name, description, image) = ($1, $2, $3) WHERE id=$4 ',
        values: [restaurant.name, restaurant.description, restaurant.image, resto_id],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch{
        throw new Error("impossible to update restaurant");
    }
}

async function updateMenu(resto_id, restaurant){
    const query = {
        text: 'UPDATE restaurants SET categories = $1 WHERE id=$2 ',
        values: [restaurant.categories, resto_id],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch{
        throw new Error("impossible to update restaurant menu");
    }
}

async function deleteRestaurants(resto_id){
    const query = {
        text: 'DELETE FROM restaurants WHERE id=$1 ',
        values: [resto_id],
    }
    try{
        var res = await db.client.query(query);
        return res;
    }catch{
        throw new Error("impossible to delete restaurant");
    }
}

const resto = {
    name: "Otacos",
    description: "Otacos villejuif wesh",
    image: "https://otacosimage.com",
}

module.exports = {
    getRestaurants,
    createRestaurants,
    updateRestaurants,
    updateMenu,
    deleteRestaurants,
}
