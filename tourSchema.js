const mongoose=require('mongoose');
const User=require('./userSchema');
const slugify=require('slugify');
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'tour must have name'],
        unique:true,
        maxlength:[40,'tour name must have less than or equal to 40 characters'],
        minlength:[10,'tour name must have more than or equal to 10 characters']
    },
    slug:String,
    duration:{
        type:Number,
        required:[true,'tour must have duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'tour must have group size']
    },
    difficulty:{
        type:String,
        required:[true,'tour must have difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message:'difficulty is either -easy,mdeium or difficult'
        }
        },
    ratingsAverage:{
        type:Number,
        default:4.5,
        max:[5,'rating must be below 5'],
        min:[1,'raing must be above 1'],
        set:val=>Math.round(val*10)/10
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'tour must have price']
    },
    priceDiscount:Number,
    summary:{
        type:String,
        required:[true,'tour must have summary'],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'tour must have cover image']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
              {
                type:{
                    type:String,
                    default:'Point',
                    enum:['Point']
                },
                coordinates:[Number],
                address:String,
                description:String,
                day:Number
              }

             ],
           
             guides:[{
                type:mongoose.Schema.ObjectId,
                ref:'User'
             }]
    
    
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
tourSchema.index({startLocation:'2dsphere'});

tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true})
    next();
})

// tourSchema.pre('save',async function(next){
//    const guidesPromises=this.guides.map( async id=>await User.findById(id));
//    this.guides=await Promise.all(guidesPromises);
//    next();
// })
tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        fields:'name photo role'
    })
    next();
})
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})
const Tour=mongoose.model('Tour',tourSchema);
module.exports=Tour;