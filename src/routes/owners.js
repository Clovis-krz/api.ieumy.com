const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const crypto = require('../middleware/crypto');
const confirmation = require('../middleware/confirmation.js');

const ownersCtrl = require('../controllers/owners');

router.post('/', ownersCtrl.sendEmailCreateOwner);
router.get('/confirm-account', confirmation.ConfirmOwnerAccount, crypto.Hash, ownersCtrl.createOwner);
router.put('/', auth.DecodeOwner, ownersCtrl.updateOwner);
router.put('/password', crypto.ValidateOwner, crypto.HashNewPassword, ownersCtrl.updateOwnerPassword);
router.put('/email', auth.DecodeOwner, ownersCtrl.SendUpdateEmailOwner);
router.get('/confirm-email', confirmation.ConfirmOwnerNewEmail, ownersCtrl.updateEmailOwner);
router.delete('/', auth.DecodeOwner, ownersCtrl.deleteOwner);
router.post('/login', crypto.ValidateOwner, ownersCtrl.loginOwner);

module.exports = router;