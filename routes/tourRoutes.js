const express=require('express');
const router=express.Router();
const tourController=require('./../controller/tourController');
const authController=require('./../controller/authController');
const reviewRouter=require('./../routes/reviewRoutes');



router.route('/').post(tourController.createTour ).get(authController.protect,tourController.getAllTours );
router.route('/stats').get(tourController.getAllStats);
router.route('/:id').get( tourController.getATour).patch(tourController.updateTour).delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);
 router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithin);
 router.route('/center/:latlng/unit/:unit').get(tourController.getDistances);
router.use('/:tourId/reviews',reviewRouter);
module.exports=router;