const db_owners = require('../db/owners.js');
const db_orders = require('../db/orders.js');
const db_subscriptions = require('../db/subscriptions.js');

exports.IsOwnerRestaurant = async (req, res, next) => {
    owner_id = req.auth.userId;
    restaurant_id = req.body.restaurant;
    try {
        result = await db_owners.getOwner(owner_id);
        if (result.restaurant == restaurant_id) {
            next();
        } else {
            res.status(401).json({message: "You don't have the permission to do that"});
        }
    } catch (error) {
        res.status(500).json({message: "cannot check restaurant owner"});
    }
}

exports.OwnerHasNoRestaurant = async (req, res, next) => {
    owner_id = req.auth.userId;
    try {
        result = await db_owners.getOwner(owner_id);
        if (result.restaurant == null) {
            next();
        } else {
            res.status(401).json({message: "You already have a restaurant"});
        }
    } catch (error) {
        res.status(500).json({message: "cannot check restaurant owner"});
    }
}

exports.OrderIsNotDone = async (req, res, next) => {
    order = req.body;
    try {
        order.id = order.order_id;
        result = await db_orders.getOrderEndTime(order);
        if (result.end_time == null) {
            next();
        } else {
            res.status(401).json({message: "This order is already done"});
        }
    } catch (error) {
        res.status(500).json({message: "cannot check order end_time"});
    }
}

exports.IsTableValidGET = async (req, res, next) => {
    resto_id = req.query.id;
    table_nb = req.query.table_nb;
    try {
        result = await db_subscriptions.getActualSubscription(resto_id);
        if (result[0].table_amount >= table_nb && table_nb > 0) {
            next();
        } else {
            res.status(401).json({message: "This table number is not valid"});
        }
    } catch (error) {
        res.status(500).json({message: "cannot check table number"});
    }
}

exports.IsTableValidPOST = async (req, res, next) => {
    resto_id = req.body.resto_id;
    table_nb = req.body.table_nb;
    try {
        result = await db_subscriptions.getActualSubscription(resto_id);
        if (result[0].table_amount >= table_nb && table_nb > 0) {
            next();
        } else {
            res.status(401).json({message: "This table number is not valid"});
        }
    } catch (error) {
        res.status(500).json({message: "cannot check table number"});
    }
}

exports.OwnerHasSubscription = async (req, res, next) => {
    var owner_id = req.auth.userId;
    try {
        result = await db_subscriptions.getActualSubscriptionByOwner(owner_id);
        if (result[0]) {
            next();
        } else {
            res.status(401).json({message: "No subscription found"});
        }
    } catch (error) {
        res.status(500).json({message: "cannot check owner subscription"});
    }
}