const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const crypto = require('../middleware/crypto');
const confirmation = require('../middleware/confirmation.js');

const customerCtrl = require('../controllers/customers');

router.post('/', customerCtrl.sendEmailCreateCustomer);
router.get('/confirm-account', confirmation.ConfirmCustomerAccount, crypto.Hash, customerCtrl.createCustomer);
router.put('/', auth.DecodeCustomer, customerCtrl.updateCustomer);
router.put('/password', crypto.ValidateCustomer, crypto.HashNewPassword, customerCtrl.updatePasswordCustomer);
router.put('/email', auth.DecodeCustomer, customerCtrl.SendUpdateEmailCustomer);
router.get('/confirm-email', confirmation.ConfirmCustomerNewEmail, customerCtrl.updateEmailCustomer);
router.delete('/', auth.DecodeCustomer, customerCtrl.deleteCustomer);
router.post('/login', crypto.ValidateCustomer, customerCtrl.loginCustomer);

module.exports = router;