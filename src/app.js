const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const morgan = require('morgan');

const customersRoutes = require('./routes/customers');
const ownersRoutes = require('./routes/owners');
const restaurantRoutes = require('./routes/restaurants');
const ordersRoutes = require('./routes/orders');
const subscriptionsRoutes = require('./routes/subscriptions');
const webhooksRoutes = require('./routes/webhooks');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/webhooks', webhooksRoutes);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/images', express.static('./images'));

app.use('/api/customers', customersRoutes);
app.use('/api/owners', ownersRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);

module.exports = app;