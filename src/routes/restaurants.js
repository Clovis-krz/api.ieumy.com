const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authorization = require('../middleware/authorization');
const multer = require('../middleware/multer');

const restaurantsCtrl = require('../controllers/restaurants');

router.get('/', authorization.IsTableValidGET, restaurantsCtrl.getOne);
router.get('/my', auth.DecodeOwner, restaurantsCtrl.getMy);
router.get('/my/stripe-account', auth.DecodeOwner, authorization.IsOwnerRestaurant, authorization.OwnerHasSubscription, restaurantsCtrl.getStripeAccount);
router.post('/', auth.DecodeOwner, authorization.OwnerHasNoRestaurant, multer.UploadPictureRestaurant, restaurantsCtrl.createRestaurant);
router.put('/', auth.DecodeOwner, authorization.OwnerHasSubscription, multer.UploadPictureUpdateRestaurant, authorization.IsOwnerRestaurant, restaurantsCtrl.updateRestaurant);
router.put('/menu', auth.DecodeOwner, authorization.IsOwnerRestaurant, authorization.OwnerHasSubscription, restaurantsCtrl.updateMenu);

router.post('/menu/category', auth.DecodeOwner, authorization.IsOwnerRestaurant, authorization.OwnerHasSubscription, restaurantsCtrl.AddCategoryMenu);
router.put('/menu/category', auth.DecodeOwner, authorization.IsOwnerRestaurant, authorization.OwnerHasSubscription, restaurantsCtrl.UpdateCategoryMenu);
router.delete('/menu/category', auth.DecodeOwner, authorization.IsOwnerRestaurant, authorization.OwnerHasSubscription, restaurantsCtrl.DeleteCategoryMenu);

router.post('/menu/item', auth.DecodeOwner, authorization.OwnerHasSubscription, multer.UploadPictureItem, restaurantsCtrl.AddItemMenu);
router.put('/menu/item', auth.DecodeOwner, authorization.OwnerHasSubscription, multer.UploadPictureUpdateItem, restaurantsCtrl.UpdateItemMenu);
router.delete('/menu/item', auth.DecodeOwner, authorization.OwnerHasSubscription, restaurantsCtrl.DeleteItemMenu);

router.post('/menu/item/variation', auth.DecodeOwner, authorization.OwnerHasSubscription, restaurantsCtrl.AddVariationItem);
router.put('/menu/item/variation', auth.DecodeOwner, authorization.OwnerHasSubscription, restaurantsCtrl.UpdateVariationItem);
router.delete('/menu/item/variation', auth.DecodeOwner, authorization.OwnerHasSubscription, restaurantsCtrl.DeleteVariationItem);

module.exports = router;