const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authorization = require('../middleware/authorization');

const ordersCtrl = require('../controllers/orders');
const subscriptionCtrl = require('../controllers/subscriptions');

router.post('/stripe/payment-status', express.raw({ type: 'application/json' }), ordersCtrl.monitorPaymentStatus);
router.post('/stripe/subscription-status', express.raw({ type: 'application/json' }), subscriptionCtrl.updateSubscription);

module.exports = router;