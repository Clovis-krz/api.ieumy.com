const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authorization = require('../middleware/authorization');
const cart_checking = require('../middleware/cart_checking');

const ordersCtrl = require('../controllers/orders');

router.get('/', auth.DecodeOwner, authorization.IsOwnerRestaurant, ordersCtrl.getOrders);
router.get('/my', ordersCtrl.getMyOrder);
router.get('/payed', auth.DecodeOwner, authorization.IsOwnerRestaurant, ordersCtrl.getPayedOrders);
router.post('/', authorization.IsTableValidPOST, cart_checking.ComputeCartTotal, auth.DecodeCustomerToCreateOrder, ordersCtrl.createOrder);
router.put('/update/served', auth.DecodeOwner, authorization.IsOwnerRestaurant, authorization.OrderIsNotDone, ordersCtrl.OrderIsServed);
router.put('/update/cancelled', auth.DecodeOwner, authorization.IsOwnerRestaurant, authorization.OrderIsNotDone, ordersCtrl.OrderIsCancelled);

module.exports = router;