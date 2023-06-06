const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../db/customers.js');
const email = require('../services/emails.js');

exports.createCustomer = async (req, res, next) => {
  var customer = req.body;
  try{
    var result = await db.createCustomer(customer);
    res.status(200).json({
      data: result.rows[0],
    })
  }catch (err){
    res.status(500).json({
      message: "cannot create customer",
    })
  }
};

exports.sendEmailCreateCustomer = async (req, res, next) => {
  var customer = req.body;
  try{
    var token = jwt.sign({ 
      email: customer.email, 
      firstname: customer.firstname,
      lastname: customer.lastname,
      password: customer.password,
      address: customer.address,
    }, process.env.JWT_CUSTOMERS_CONFIRM, { expiresIn: '1h' });
    await email.SendConfirmEmailCustomer(customer.email, token);
    res.status(200).json({
      message: "success, please confirm registration by clicking the link in the email",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot send email to activate customer",
    })
  }
};

exports.updateCustomer = async (req, res, next) => {
  var customer = req.body;
  customer.userId = req.auth.userId;
  try{
    await db.updateCustomer(customer);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot update customer",
    })
  }
};

exports.SendUpdateEmailCustomer = async (req, res, next) => {
  var customer = req.body;
  try{
    var token = jwt.sign({ 
      userId: req.auth.userId, 
      new_email: customer.new_email,
    }, process.env.JWT_CUSTOMERS_CONFIRM_EMAIL, { expiresIn: '1h' });
    var user_data = await db.getCustomer(req.auth.userId);
    await email.SendConfirmUpdateEmailCustomer(customer.new_email, token);
    res.status(200).json({
      message: "success, please confirm email update by clicking the link in the email",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot send email to update customer email",
    })
  }
};

exports.updateEmailCustomer = async (req, res, next) => {
  var customer = req.body;
  customer.userId = req.body.userId;
  try{
    customer.email = customer.new_email;
    await db.updateEmailCustomer(customer);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot update customer email",
    })
  }
};

exports.updatePasswordCustomer = async (req, res, next) => {
  var customer = req.body;
  try{
    var customer_data = await db.loginCustomer(customer.email);
    customer.userId = customer_data.id;
    customer.password = req.body.hash;
    await db.updatePasswordCustomer(customer);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot update customer password",
    })
  }
};

exports.deleteCustomer = async (req, res, next) => {
  var customer = req.body;
  customer.userId = req.auth.userId;
  try{
    await db.deleteCustomer(customer);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot delete customer",
    })
  }
};

exports.loginCustomer = async (req, res, next) => {
  try {
    var account = await db.loginCustomer(req.body.email);
    var token = jwt.sign({ userId: account.id }, process.env.JWT_CUSTOMERS, { expiresIn: '1h' });
    var data_response = {
      email: account.email,
      firstname: account.firstname,
      lastname: account.lastname
    }
    res.status(200).json({jwtoken: token, data: data_response});
  } catch (error) {
    res.status(500).json({message: "cannot get account"})
  }
  
}
