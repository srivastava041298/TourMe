const Review=require('./../reviewSchema');
const factory=require('./../controller/handlerFactory');
const Tour=require('./../tourSchema');
exports.setTourUserId=(req,res,next)=>{
    if(!req.body.tour)
    req.body.tour=req.params.tourId;
    if(!req.body.user)
    req.body.user=req.user.id;
    next();
}
exports.createReview=factory.createOne(Review);
exports.updateReview=factory.updateOne(Review);
exports.deleteReview=factory.deleteOne(Review);
exports.getReviews=async (req,res,next)=>{
    try{
        let filter={};
        if(req.params.tourId)
        filter={tour:req.params.tourId};

       const reviews=await Review.find(filter);
       res.status(200).json({
        status:'success',
        data:{
            review:reviews
        }
       })
    }
    catch(err)
    {
        res.status(404).json({
            status:'fail',
            message:err
           })
    }
}
 
// exports.calcUpdatedAvgRating=async function(tourId)
// {   
//     if(createReview || updateReview)
//     {
//         const stats= await  Review.aggregate([
//             {
//                 $match:{tour:tourId}
//             },
//             {
//              $group:{_id:'$tour',
//                        numRating:{$sum:1},
//                        averageRating:{$avg:'$rating'}
//                     }
//             }
//            ])
//            if(stats.length>0)
//         {
//             await Tour.findByIdAndUpdate(tourId,{
//                 ratingsAverage:stats[0].averageRating,
//                 ratingsQuantity:stats[0].numRating
            
//             })
//         }
//         else{
//             await Tour.findByIdAndUpdate(tourId,{
//                 ratingsAverage:4.5,
//                 ratingsQuantity:0
            
//             })
//         }
//     }
//     else{
//         console.log('create review not done');
//     }
  
  
// }