const AppError = require("../utils/handleError");
const User = require("./../userSchema");
const factory=require('./../controller/handlerFactory');
const multer=require('multer');
const Jimp=require('jimp');


exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}
exports.getUser=factory.getOne(User);

exports.getAllUsers=factory.getAll(User);

filterObj=(obj,...allowedFields)=>{
    const newObj={};
 Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el))
     newObj[el]=obj[el];
 })
 return newObj;
}
// const multerStorage=multer.memoryStorage();
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/user');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});
const multerFilter=(req,file,cb)=>{

    if(file.mimetype.startsWith('image'))
    {
     cb(null,true);
    }
    else{
        cb(new AppError('Not a image! Please upload only images.',400),false);
    }
}
const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});
exports.uploadUserPhoto=upload.single('photo');
// exports.resizeUserPhoto=async(req,res,next)=>{
    
//         const image=await Jimp.read(`public/img/user/${req.file.filename}`);
            
//             image.resize(500, 500)
//                  .quality(90)
//                  .write(`public/img/user/${req.file.filename}`);        
                 
//     next();
// }

exports.updateMe=async (req,res,next)=>{
    try{
        if(req.body.password || req.body.confirmPassword)
        {
            return next(new AppError('This route is not for password update.Please use /updateMyPassword',400));
        }
        const filteredBody=filterObj(req.body,'name','email');
        if(req.file)
        filteredBody.photo=req.file.filename;
        const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status:'success',
            data:{
                user:updatedUser
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
exports.deleteMe=async (req,res,next)=>{
    try{
       await User.findByIdAndUpdate(req.user.id,{active:false});
       res.status(204).json({
        status:'success',
        data:null
        
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