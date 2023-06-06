const db_resto =require('../db/restaurants');

exports.ComputeCartTotal = async (req, res, next) => {
    var cart = req.body.items;
    var resto_id = req.body.resto_id;
    try {
        var resto = await db_resto.getRestaurants(resto_id);
        cart_total = compute_total(cart, resto.categories);
        req.cart_total = cart_total;
        next();
    } catch (error) {
        res.status(500).json({message: "error, cannot check cart items"});
    }
}

function compute_total(cart, items){
    var price = 0;
    for (const item in cart) {
        try {
            if (typeof cart[item].id === 'undefined' || typeof cart[item].qty === 'undefined' || typeof cart[item].variation === 'undefined') {
                return Error('compute total wrong parameters');
            }
            else{
                price += findprice(cart[item], items);
            }
        } catch (error) {
            return Error('compute total wrong parameters');
        }
        
    }
    return price;
}

function findprice(item_cart, items){
    item_price = 0;
    for(var category in items) {
        for(var item_from_items in items[category]) {
            if (items[category][item_from_items].id == item_cart.id) {
                if (items[category][item_from_items].name != item_cart.name) {
                    return Error('compute total wrong parameters');
                }
                item_price = items[category][item_from_items].price;
                if (item_cart.variation != null) {
                    var variation_price = findvariation(item_cart.variation, items[category][item_from_items].variations);
                    item_price += variation_price;
                }
                item_price = item_price*item_cart.qty;
            }
        }
    }
    return item_price;
}

function findvariation(variation, variations){
    var delta_price = 0;
    var found = false;
    for (const varia in variations) {
        if (variations[varia].name == variation.name) {
            delta_price = variations[varia].price_delta;
            found = true;
        }
    }
    if (found) {
        return delta_price;
    } else {
        return Error('findvariation: variation doesnt exit');
    }
    
}