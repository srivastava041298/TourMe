const AppError = require("../utils/handleError");
const APIFeatures=require('./../utils/APIFeatures');
 exports.createOne=Model=> async(req,res,next)=>{
    try{
        const doc= await Model.create(req.body);
        res.status(201).json({
           status:'success',
           data:{
               Data:doc
           }
        })
    }
    catch(err)
    {
        if(err.code===11000)
        {
            const message=`Duplicate name: ${err.keyValue.name}`;
         return next(new AppError(message,404));
        }
        else{
            res.status(404).json({
                status:'fail',
                message:err
               
            })
        }
       
        console.log(err);
       }  
    
}
exports.getAll=Model=> async(req,res,next)=>{
    try{
        const features=new APIFeatures(Model.find(),req.query).filter().sort().limitFields().paginate();
      const  doc=await features.query;
      
      res.status(201).json({
       status:'success',
       data:{
           data:doc
       }
    })
   }
   catch(err)
{
res.status(404).json({
    status:'fail',
    message:'Invalid data!'
   
})
console.log(err);
} 
}
exports.updateOne=Model=>async(req,res,next)=>{
    try{
   const  updatedDoc=await Model.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
   });
   if(updatedDoc){
   res.status(201).json({
    status:'success',
    data:{
        data:updatedDoc
    }
 })
}
 else{
    res.status(404).json({
        status:'fail',
        message:'Doc not found!'
 })
}
    }
catch(err)
{
    if(err.name==='ValidationError')
    {
        const error=Object.values(err.errors).map(el=>el.message).join('. ');
        const message=`Invalid Data.${error}`
        return next(new AppError(message,404));
    }
    else{
        res.status(404).json({
            status:'fail',
            meassage:'Invalid data!'
           
        })
    }

console.log(err);
}   
}
exports.getOne=(Model,populateOptions)=>async(req,res,next)=>{
    try{

   let query=await Model.findById(req.params.id);
   if(populateOptions)
   query=query.populate(populateOptions);
   const doc=await query;
   if(doc){
   res.status(201).json({
    status:'success',
    data:{
        data:doc
    }
 })
}
 else{
    res.status(404).json({
        status:'fail',
        message:'doc not found!'
 })
}
    }
catch(err)
{
    if(err.name==='CastError')
    {
        const message=`Invalid ${err.path}: ${err.value}`;
        return next(new AppError(message,404));
    }
    else{
        res.status(404).json({
            status:'fail',
            meassage:'Invalid data!'
           
        })
    }


console.log(err);
}   
}
exports.deleteOne=Model=>async(req,res)=>{
    try{
   await Model.findByIdAndDelete(req.params.id);
   
   res.status(201).json({
    status:'success',
    
 })
    }
    
catch(err)
{
res.status(404).json({
    status:'fail',
    meassage:'Invalid data!'
   
})
console.log(err);
}   
}