const Tour=require('./../tourSchema');
const Booking=require('./../bookingSchema');
const User=require('./../userSchema');
exports.getOverview=async(req,res)=>{
    const tours=await Tour.find();

        res.status(200).render('overview',{
            title:'All Tours',
            tours
        })

    }
   
   

exports.getTour=async(req,res)=>{
    const tour=await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        field:'review rating user'
    });
    res.status(200).render('tour',{
        title:`${tour.name} Tour` ,
        tour
    });
}
exports.getLogin=(req,res)=>{
    res.status(200).render('login',{
        title:'Login'
    })
}
exports.getAccount=(req,res)=>{
    res.status(200).render('account',{
        title:'Account'
    })
}
exports.signup=(req,res)=>{
        res.status(200).render('signup',{
            title:'Create new account'
        })
}
exports.forgetPassword=(req,res)=>{
    res.status(200).render('forget-password',{
        title:'Forget Password'
    })
}
exports.resetPassword=(req,res)=>{
    res.status(200).render('resetPass',{
        title:'Reset Password',
        token:req.params.token
    })
}
exports.getMyTours = async (req, res, next) => {
    try{
        // 1) Find all bookings
        const bookings = await Booking.find({ user: req.user.id });
        
        // 2) Find tours with the returned IDs
        const tourIDs = bookings.map(el => el.tour);
        const tours = await Tour.find({ _id: { $in: tourIDs } });

        res.status(200).render('overview', {
        title: 'My Tours',
        tours
        });
    }
    catch(err)
    {
        res.status(401).json({
            status:'fail',
            message:err.message
          })
    }
   
  };

// exports.updateUserData=async(req,res,next)=>{
//     try{
//        const updatedUser=await User.findByIdAndUpdate(req.user.id,{
//                     name:req.body.name,
//                     email:req.body.email
//        },
//        {
//         new:true,
//         runValidators:true
//        })

    
//     res.status(200).render('account',{
//         title:'Account',
//         user:updatedUser
//     })
// }
//     catch(err)
//     {
//         res.status(400).json({
//             status:'fail'
//         })
//     }
// }




