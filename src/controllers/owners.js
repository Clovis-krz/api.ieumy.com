const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_KEY);
require('dotenv').config();
const db = require('../db/owners.js');
const db_resto = require('../db/restaurants.js');
const db_orders = require('../db/orders.js');
const email = require('../services/emails.js');

exports.createOwner = async (req, res, next) => {
  try{
    var owner = req.body;
    const customer = await stripe.customers.create({
      email: owner.email,
      name: owner.firstname +" "+owner.lastname
    });
    owner.stripe_id = customer.id;
    var result = await db.createOwner(owner);
    res.status(200).json({
      data: result.rows[0],
    })
  }catch (err){
    res.status(500).json({
      message: "cannot create owner",
    })
  }
};

exports.sendEmailCreateOwner = async (req, res, next) => {
  var owner = req.body;
  try{
    var token = jwt.sign({ 
      email: owner.email, 
      firstname: owner.firstname,
      lastname: owner.lastname,
      password: owner.password,

    }, process.env.JWT_OWNERS_CONFIRM, { expiresIn: '1h' });
    await email.SendConfirmEmailOwner(owner.email, token);
    res.status(200).json({
      message: "success, please confirm registration by clicking the link in the email",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot send email to activate owner",
    })
  }
};

exports.updateOwner = async (req, res, next) => {
  var owner = req.body;
  owner.userId = req.auth.userId;
  try{
    await db.updateOwner(owner);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot update owner",
    })
  }
};

exports.SendUpdateEmailOwner = async (req, res, next) => {
  var owner = req.body;
  try{
    var token = jwt.sign({ 
      userId: req.auth.userId, 
      new_email: owner.new_email,
    }, process.env.JWT_OWNERS_CONFIRM_EMAIL, { expiresIn: '1h' });
    var owner_data = await db.getOwner(req.auth.userId);
    await email.SendConfirmUpdateEmailOwner(owner.new_email, token);
    res.status(200).json({
      message: "success, please confirm email update by clicking the link in the email",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot send email to update owner email",
    })
  }
};

exports.updateEmailOwner = async (req, res, next) => {
  var owner = req.body;
  owner.userId = req.body.userId;
  try{
    owner.email = owner.new_email;
    await db.updateOwnerEmail(owner);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot update owner email",
    })
  }
};

exports.updateOwnerPassword = async (req, res, next) => {
  var owner = req.body;
  try{
    var owner_data = await db.loginOwner(owner.email);
    owner.userId = owner_data.id;
    owner.password = req.body.hash;
    await db.updateOwnerPassword(owner);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot update owner password",
    })
  }
};

exports.deleteOwner = async (req, res, next) => {
  var owner = req.body;
  owner.userId = req.auth.userId;
  try{
    var owner_data = await db.getOwner(owner.userId);
    await db_resto.deleteRestaurants(owner_data.restaurant);
    await db_orders.deleteOrders(owner_data);
    await db.deleteOwner(owner);
    res.status(200).json({
      message: "success",
    })
  }catch (err){
    res.status(500).json({
      message: "cannot delete owner",
    })
  }
};

exports.loginOwner = async (req, res, next) => {
  try {
    var account = await db.loginOwner(req.body.email);
    var token = jwt.sign({ userId: account.id }, process.env.JWT_OWNERS, { expiresIn: '1h' });
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