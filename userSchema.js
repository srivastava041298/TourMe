const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter your name']
    },
    email:{
        type:String,
        required:[true,'please enter your email'],
        lowercase:true,
        unique:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength:8,
        
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(el)
            {
                return el===this.password;
            },
            message:'Password is not the same'
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }

});
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    return next();
    this.password=await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
});
userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew)
    return next();
    this.passwordChangedAt=Date.now()-1000;
    next();
})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword)
{
    return await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changedPassword=function(JWTTimeStamp)
{
    if(this.passwordChangedAt)
    { 
        const changedTimeStamp=(this.passwordChangedAt.getTime())/1000;
        // console.log(changedTimeStamp,JWTTimeStamp);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
}
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
}

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
})
const User=mongoose.model('User',userSchema);
module.exports=User;