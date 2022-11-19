const express=require('express');
const router=express.Router();
const authController=require('./../controller/authController');
const userController=require('./../controller/userContoller');
router.route('/signup').post(authController.signup);

router.route('/login').post(authController.login);
router.route('/logout').get(authController.logOut);
router.route('/').get(userController.getAllUsers);
router.route('/me').get(authController.protect,userController.getMe,userController.getUser);
router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/updateMyPassword').patch(authController.protect,authController.updatePassword);
router.route('/updateMe').patch(authController.protect,userController.uploadUserPhoto,userController.updateMe);
router.route('/deleteMe').delete(authController.protect,userController.deleteMe);
module.exports=router;