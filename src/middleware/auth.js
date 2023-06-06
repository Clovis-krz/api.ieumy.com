const jwt = require('jsonwebtoken');
require('dotenv').config();
const db_customers =require('../db/customers');

exports.DecodeCustomer = (req, res, next) => {
   try {
       const token = req.headers.authorization;
       const decodedToken = jwt.verify(token, process.env.JWT_CUSTOMERS);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
}

exports.DecodeOwner = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_OWNERS);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
     next();
    } catch(error) {
        res.status(401).json({ error });
    }
}

exports.DecodeCustomerToCreateOrder = async (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization;
            const decodedToken = jwt.verify(token, process.env.JWT_CUSTOMERS);
            const userId = decodedToken.userId;
            req.auth = {
                userId: userId
            };
            var customer = await db_customers.getCustomer(userId);
            req.body.lastname = customer.lastname;
            req.body.firstname = customer.firstname;
            req.body.email = customer.email; 
            next();
        } catch(error) {
            res.status(400).json({message: "error, invalid jwt token"});
        }
    } else {
        if (req.body.email != "" && req.body.firstname != "" && req.body.lastname != "") {
            const userId = null;
            req.auth = {
                userId: userId
            };
            next();
        } else {
            res.status(400).json({message: "error, missing parameters to create an order"});
        }
        
    }
    
 }