const nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

async function SendConfirmEmailCustomer(receiver, token) {
  let info = await transporter.sendMail({
    from: '"Ieumy" <contact@ieumy.com>', // sender address
    to: receiver, // list of receivers
    subject: "Confirm Your Email", // Subject line
    text: "", // plain text body
    html: "<b>Welcome !</b><p>To activate your customer account, you need to confirm your account within 15min</p><br/><p><a href='https://ieumy.com/customers/confirm-account?token="+token+"'>Click here</a> to activate</p>",
  });

  console.log("Message sent: %s", info.messageId);
}

async function SendConfirmUpdateEmailCustomer(receiver, token) {
  let info = await transporter.sendMail({
    from: '"Ieumy" <contact@ieumy.com>', // sender address
    to: receiver, // list of receivers
    subject: "Confirm Your new Email", // Subject line
    text: "", // plain text body
    html: "<b>Hi !</b><p>To update your email, you need to click here within 15min</p><br/><p><a href='https://ieumy.com/customers/confirm-email-update?token="+token+"'>Click here</a> to activate</p>"
    +"<p>If you did not initiated this request please do not click on this link, and contact us by email</p>",
  });

  console.log("Message sent: %s", info.messageId);
}

async function SendConfirmUpdateEmailOwner(receiver, token) {
  let info = await transporter.sendMail({
    from: '"Ieumy" <contact@ieumy.com>', // sender address
    to: receiver, // list of receivers
    subject: "Confirm Your new Owner Email", // Subject line
    text: "", // plain text body
    html: "<b>Hi !</b><p>To update your Owner email, you need to click here within 15min</p><br/><p><a href='https://ieumy.com/owners/confirm-email-update?token="+token+"'>Click here</a> to activate</p>"
    +"<p>If you did not initiated this request please do not click on this link, and contact us by email</p>",
  });

  console.log("Message sent: %s", info.messageId);
}

async function SendConfirmEmailOwner(receiver, token) {
    let info = await transporter.sendMail({
      from: '"Ieumy" <contact@ieumy.com>', // sender address
      to: receiver, // list of receivers
      subject: "Confirm Your Email", // Subject line
      text: "", // plain text body
      html: "<b>Welcome !</b><p>To activate your restaurant owner account, you need to confirm your account within 15min</p><br/><p><a href='https://ieumy.com/owners/confirm-account?token="+token+"'>Click here</a> to activate</p>",
    });
  
    console.log("Message sent: %s", info.messageId);
  }

async function SendConfirmOrder(order_nb, receiver, lastname, firstname, restaurant, order, total_price) {
    let info = await transporter.sendMail({
      from: '"Ieumy" <contact@ieumy.com>', // sender address
      to: receiver, // list of receivers
      subject: "Thanks for your order from "+restaurant, // Subject line
      text: "", // plain text body
      html: "<b>Hi "
      +firstname
      +", your payment just went trough the chef is preparing your order !</b><p>Your order Number is "
      +order_nb+", and the name attached to the order is: "+lastname+" (use this order number and your name in case of problems)</p>"
      +"<p>Here is the list of products in your order :"
      +displayCartItems(order, total_price)
      +"<br><br>"
      +"Thanks for your trust in Ieumy and Bon Appetit !"
      +"</p>",
    });
  
    console.log("Message sent: %s", info.messageId);
  }

function displayCartItems(cart, total){
  var cart_html = "<br><br>";
    for (const item in cart) {
      try{
        cart_html += "- "+cart[item].qty+"*"+cart[item].name;
        if (cart[item].variation != null) {
          cart_html += " /"+cart[item].variation.name+"/";
        }
    
        cart_html += "<br>";
      }
      catch (error) {
        return Error('cannot display cart');
      }
    }
  cart_html += "<br>TOTAL: "+total+"€";
  return cart_html;
}

async function SendCancelledOrder(order_nb, receiver, firstname, restaurant, total_price) {
  let info = await transporter.sendMail({
    from: '"Ieumy" <contact@ieumy.com>', // sender address
    to: receiver, // list of receivers
    subject: "Your order #"+order_nb+" from "+restaurant+" has just been Cancelled!", // Subject line
    text: "", // plain text body
    html: "<b>Hi "
    +firstname
    +", for some reason your order #"+order_nb+" at "+restaurant+" has been cancelled by the Restaurant</b>"
    +"<p>The refund of the sum of "+total_price+"€ has just been submitted and should appear on your account within 5 to 10 open days</p>"
    +"<p>Thanks for your patience and please accept our apologies for the inconvenience,</p>"
    +"<p>Sincerly,<br> Ieumy. </p>"
  });

  console.log("Message sent: %s", info.messageId);
}

async function SendConfirmSubscription(receiver, firstname, restaurant, quantity) {
  let info = await transporter.sendMail({
    from: '"Ieumy" <contact@ieumy.com>', // sender address
    to: receiver, // list of receivers
    subject: "Your Subscription for "+restaurant+" is activated", // Subject line
    text: "", // plain text body
    html: "<b>Hi "
    +firstname
    +", your payment just went trough and your subscription for "+restaurant+" of "+quantity+" tables is active !</b>"
    +"<p> You can find more information and your receipt in the settings of your account </p>"
    +"<p>Thanks for your trust in Ieumy !"
    +"</p>",
  });

  console.log("Message sent: %s", info.messageId);
}

async function SendConfirmRenewal(receiver, firstname, restaurant) {
  let info = await transporter.sendMail({
    from: '"Ieumy" <contact@ieumy.com>', // sender address
    to: receiver, // list of receivers
    subject: "Your Subscription for "+restaurant+" has been renewed", // Subject line
    text: "", // plain text body
    html: "<b>Hi "
    +firstname
    +", your payment just went trough and your subscription for "+restaurant+" has been renewed !</b>"
    +"<p> You can find more information and your receipt in the settings of your account </p>"
    +"<p>Thanks for your trust in Ieumy !"
    +"</p>",
  });

  console.log("Message sent: %s", info.messageId);
}

async function SendFailedPaymentSubscription(receiver, firstname) {
  let info = await transporter.sendMail({
    from: '"Ieumy" <contact@ieumy.com>', // sender address
    to: receiver, // list of receivers
    subject: "Your Subscription payment failed", // Subject line
    text: "", // plain text body
    html: "<b>Hi "
    +firstname
    +", the payment for your subscription just failed !</b>"
    +"<p> Please update your payment information in the settings of your account as soon as possible to still enjoy our service </p>"
    +"<p>Thanks for your trust in Ieumy !"
    +"</p>",
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = {
    SendConfirmEmailCustomer,
    SendConfirmUpdateEmailCustomer,
    SendConfirmUpdateEmailOwner,
    SendConfirmEmailOwner,
    SendConfirmOrder,
    SendCancelledOrder,
    SendConfirmSubscription,
    SendConfirmRenewal,
    SendFailedPaymentSubscription,
}