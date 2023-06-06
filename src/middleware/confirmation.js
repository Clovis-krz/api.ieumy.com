const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.ConfirmCustomerAccount = (req, res, next) => {
   try {
       const token = req.query.token;
       const decodedToken = jwt.verify(token, process.env.JWT_CUSTOMERS_CONFIRM);
       req.body = decodedToken;
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
}

exports.ConfirmOwnerAccount = (req, res, next) => {
    try {
        const token = req.query.token;
        const decodedToken = jwt.verify(token, process.env.JWT_OWNERS_CONFIRM);
        req.body = decodedToken;
     next();
    } catch(error) {
        res.status(401).json({ error });
    }
}

exports.ConfirmCustomerNewEmail = (req, res, next) => {
    try {
        const token = req.query.token;
        const decodedToken = jwt.verify(token, process.env.JWT_CUSTOMERS_CONFIRM_EMAIL);
        req.body = decodedToken;
     next();
    } catch(error) {
        res.status(401).json({ error });
    }
 }

 exports.ConfirmOwnerNewEmail = (req, res, next) => {
    try {
        const token = req.query.token;
        const decodedToken = jwt.verify(token, process.env.JWT_OWNERS_CONFIRM_EMAIL);
        req.body = decodedToken;
     next();
    } catch(error) {
        res.status(401).json({ error });
    }
 }