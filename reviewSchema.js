const mongoose=require('mongoose');
const Tour = require('./tourSchema');
const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review cannot be empty']
    },
    rating:{
        type:Number,
        max:5,
        min:1
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'review must belong to a tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'review must belong to a user']
         }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)
reviewSchema.index({tour:1,user:1},{unique:true});

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'tour',
        select:'name'
    }).populate({
        path:'user',
        select:'name photo'
    })
    next();
})
reviewSchema.statics.calculateAvgRating=async function(tourId){
const stats=await this.aggregate([
    {
        $match:{tour:tourId}
    },
    {
     $group:{_id:'$tour',
               numRating:{$sum:1},
               averageRating:{$avg:'$rating'}
            }
    }
])
if(stats.length>0)
{
    await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:stats[0].averageRating,
        ratingsQuantity:stats[0].numRating
    
    })
}
else{
    await Tour.findByIdAndUpdate(tourId,{
        ratingsAverage:4.5,
        ratingsQuantity:0
    
    })
}
// console.log(stats);

}
reviewSchema.post('save',function(){
    this.constructor.calculateAvgRating(this.tour);
    
});
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r=  await this.clone().findOne();
   
    // console.log(this.r);
    next();
})
reviewSchema.post(/^findOneAnd/, async function(){
   
    await this.r.constructor.calculateAvgRating(this.r.tour);
 
})
const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;