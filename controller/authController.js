const User = require("./../userSchema");
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const dotenv=require('dotenv');
const AppError = require("../utils/handleError");
const Email=require('./../utils/email');
dotenv.config({path:'./config.env'});
exports.signup= async(req,res,next)=>{
     try{
        const newUser=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            // passwordChangedAt:req.body.passwordChangedAt,
            // role:req.body.role
        });
        const url=`http://127.0.0.1:3000/login`;
        await new Email(newUser,url).sendWelcome();
        const token=await jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        res.cookie('jwt',token,{
            expires:new Date(Date.now()+90*24*60*60*1000),
            secure:true,
            httpOnly:true,
            sameSite:'none'
        })
       res.status(201).json({
        token,
        status:'success',
        data:{
            user:newUser
        }
       })
     }
     catch(err)
     {  if(err.name==='ValidationError')
     {
         const error=Object.values(err.errors).map(el=>el.message).join('. ');
         const message=`Invalid Data.${error}`
         return next(new AppError(message,404));
     }
     else if(err.message.indexOf("11000") != -1)
     {
         // run some code here //
        return next(new AppError('Email already exists!',404));
     }
     else{
         res.status(404).json({
             status:'fail',
             message:err.message
         })
     }
       
     }
}
exports.login=async(req,res,next)=>{
    try{
        const password=req.body.password;
        const email=req.body.email;
        if(!email || !password)
        {
            return next(new AppError('Please provide email and password',401));
        }
       const user=await User.findOne({email:email});
    //    console.log(user);
       if(!user || !await user.correctPassword(password,user.password))
       {
        return next(new AppError('Invalid email or password',401));
       }
       const token=await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
       res.cookie('jwt',token,{
        expires:new Date(Date.now()+90*24*60*60*1000),
         secure:true,
        httpOnly:true,
        sameSite:'none'
    })
       res.status(201).json({
        status:'success',
         token
         
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
exports.protect=async (req,res,next)=>{
    try{
        let token;
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
      {
         token=req.headers.authorization.split(' ')[1];
        //  console.log(token);
      }
      else if(req.cookies.jwt)
      {
        token=req.cookies.jwt;
      }
      if(!token)
      {
        return next(new AppError('You are not logged In! Please login to get acccess!',401));
      }
      const decoded=await jwt.verify(token,process.env.JWT_SECRET);
    //   console.log(decoded);
      const currentUser=await User.findById(decoded.id);
      if(!currentUser)
      {
        return next(new AppError('User belonging to this token doesnot exist!',401));
      }
      if(currentUser.changedPassword(decoded.iat))
      {
        return next(new AppError('User recently changed password!Please Login again!',401));  
      }
      req.user=currentUser;
      res.locals.user=currentUser;
      next();
    }
  
    catch(err)
    {   
        if(err.name==='JsonWebTokenError')
        {
            return next(new AppError('Invalid Token! Please login again!'));
        }
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
  
}
exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
     if(!roles.includes(req.user.role))
     {
        return next(new AppError('You donot have permission to perform this action!',403));
     }
     next();
    }
  
}
exports.forgetPassword=async (req,res,next)=>{
    
        const user=await User.findOne({email:req.body.email});
        if(!user)
        {
            return next(new AppError('There is no user with this email address!',404));
        }
        const resetToken=user.createPasswordResetToken();
        // console.log(resetToken);
        await user.save({validateBeforeSave:false});
         
         try{
            const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
            await new Email(user, resetURL).sendPasswordReset();
              
            res.status(200).json({
                status:'success',
                message:'Token sent to Email!'
            })
        next()
         }
         
    
    catch(err)
    {
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});
       return next(new AppError('There was an error sending this email.Try again later!',500));

        
    }
}
exports.resetPassword=async (req,res,next)=>{
    try{
        const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user= await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});
        if(!user)
        {
            return next(new AppError('Token is invalid or has expired!',400));
        }
        user.password=req.body.password;
        user.confirmPassword=req.body.confirmPassword;
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save();
    
        const token= await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        res.status(200).json({
            status:'success',
            token
        })
    }
    catch(err)
    {  if(err.name==='ValidationError')
    {
        const error=Object.values(err.errors).map(el=>el.message).join('. ');
        const message=`Invalid Data.${error}`
        return next(new AppError(message,404));
    }
    else{
        res.status(404).json({
            status:'fail'
        })
    }
      
    }
}
exports.updatePassword=async (req,res,next)=>{
    try{
       const user=await User.findById(req.user.id);
    //    console.log(user.password,req.body.currentPassword);

       if(!(await user.correctPassword(req.body.currentPassword,user.password)))
       {
        return next(new AppError('Current password do not match with the original password!',401));
       }
       user.password=req.body.password;
       user.confirmPassword=req.body.confirmPassword;
       await user.save();
       const token= await jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        res.status(200).json({
            status:'success',
            token
        })
    }
    catch(err)
    {
          if(err.name==='ValidationError')
            {
                const error=Object.values(err.errors).map(el=>el.message).join('. ');
                const message=`Invalid Data.${error}`
                return next(new AppError(message,404));
            }
            else
            {
                res.status(404).json({
                    status:'fail'
                })
            }
       
           
    
    }
}
exports.isLoggedIn=async (req,res,next)=>{
    try{
         if(req.cookies.jwt)
      {
        
      const decoded=await jwt.verify(req.cookies.jwt,process.env.JWT_SECRET);
      const currentUser=await User.findById(decoded.id);
      if(!currentUser)
      {
        return next();
      }
      if(currentUser.changedPassword(decoded.iat))
      {
        return next();  
      }
      res.locals.user=currentUser;
      return next();
    }
    next();
}
  
    catch(err)
    {   
        
        return next();
    }
   
}
exports.logOut=(req,res)=>{
    res.cookie('jwt','loggedOut',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.status(200).json({
        status:'success'
    });

}
