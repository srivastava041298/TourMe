const express=require('express');
const authController=require('./../controller/authController');
const reviewController=require('./../controller/reviewController');
const router=express.Router({mergeParams:true});
router.route('/').post(authController.protect,authController.restrictTo('user'),reviewController.setTourUserId,reviewController.createReview).get(reviewController.getReviews);
router.route('/:id').patch(reviewController.updateReview).delete(reviewController.deleteReview);
module.exports=router;