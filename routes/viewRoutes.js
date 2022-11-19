const express=require('express');
const viewController=require('./../controller/viewController');
const authController=require('./../controller/authController');
const bookingController=require('./../controller/bookingController');
const router=express.Router();



router.route('/').get(authController.isLoggedIn,bookingController.createBookingCheckout,viewController.getOverview);
router.route('/my-tours').get(authController.protect,viewController.getMyTours);
router.route('/tour/:slug').get(authController.isLoggedIn,viewController.getTour);
router.route('/login').get(authController.isLoggedIn,viewController.getLogin);
router.route('/me').get(authController.isLoggedIn,viewController.getAccount);
router.route('/signup').get(authController.isLoggedIn,viewController.signup);
router.route('/forget-password').get(authController.isLoggedIn,viewController.forgetPassword);
router.route('/resetPassword/:token').get(authController.isLoggedIn,viewController.resetPassword);
// router.route('/submit-user-data').post(authController.protect,viewController.updateUserData);
module.exports=router;