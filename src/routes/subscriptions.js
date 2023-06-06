const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authorization = require('../middleware/authorization');

const subscriptionsCtrl = require('../controllers/subscriptions');

router.get('/current', auth.DecodeOwner, authorization.IsOwnerRestaurant, subscriptionsCtrl.getActualSubscription);
router.get('/manage-link', auth.DecodeOwner, subscriptionsCtrl.getPortalLinkSubscription);
router.post('/new', auth.DecodeOwner, authorization.IsOwnerRestaurant, subscriptionsCtrl.createSubscription);

module.exports = router;