const bcrypt = require('bcrypt');

const db_owners = require('../db/owners.js');
const db_customers = require('../db/customers.js');

const saltRounds = 10;

exports.Hash = async (req, res, next) => {
    bcrypt.genSalt(saltRounds, async function(err, salt) {
        try {
            var hash = await bcrypt.hash(req.body.password, salt);
            req.body.hash = hash;
            next();
        } catch (error) {
            res.status(500).json({message: "error, cannot hash password"});
        }
        
    });
}

exports.HashNewPassword = async (req, res, next) => {
    bcrypt.genSalt(saltRounds, async function(err, salt) {
        try {
            var hash = await bcrypt.hash(req.body.new_password, salt);
            req.body.hash = hash;
            next();
        } catch (error) {
            res.status(500).json({message: "error, cannot hash password"});
        }
        
    });
}

exports.ValidateOwner = async (req, res, next) => {
    var password = req.body.password;
    try {
        var hash = await db_owners.getPasswordHashOwners(req.body.email);
        var result = await bcrypt.compare(password, hash);
        if (result) {
            next();
        } else {
            res.status(500).json({message: "error, wrong password"});
        }
    } catch (error) {
        res.status(500).json({message: "error, cannot validate password"});
    }
    
}

exports.ValidateCustomer = async (req, res, next) => {
    var password = req.body.password;
    try {
        var hash = await db_customers.getPasswordHashCustomers(req.body.email);
        var result = await bcrypt.compare(password, hash);
        if (result) {
            next();
        } else {
            res.status(500).json({message: "error, wrong password"});
        }
    } catch (error) {
        res.status(500).json({message: "error, cannot validate password"});
    }
    
}