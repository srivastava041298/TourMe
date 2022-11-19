const compression= require('compression');
const express=require('express');
const path=require('path');
const fs=require('fs');
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');
const viewRouter=require('./routes/viewRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const bookingRouter=require('./routes/bookingRoutes');
const AppError = require('./utils/handleError');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser=require('cookie-parser');
const app=express();
app.use(express.json());
app.use(express.urlencoded({extented:true}));
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist:['duration','ratingsAverage','ratingsQuantity','difficulty','maxGroupSize']
}));
app.use(compression());

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    
    next();
})
app.use(cookieParser());
app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.use('/api/v1/booking',bookingRouter);

app.all('*',(req,res)=>{
    res.render('404',{
        message:"Page couldn't be found!"    
    })
})

app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    
   
})
        
   
 























//...........................................................................................
// let tour=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,'utf-8'));
// app.get('/api/v1/tours',(req,res)=>{
    
//     res.json({
//         status:'success',
        
//         data:{
//             tours:tour
//         }
//     })
//     });

//  app.get('/api/v1/tours/:id',(req,res)=>{
//     console.log(req.params);
//     const id=req.params.id*1;
//     // console.log(id);
//     // console.log(tour);
//     const tourFind=tour.find(el=>el.id===id);
//     if(!tourFind)
//     {
//         return res.status(404).json({
//             status:'fail',
//             message:'Tour not found'
//         })
//     }
//     res.status(200).json({
//         status:'success',
//         data:{
//             tourFind
//         }
//     })
//  })   
//  app.post('/api/v1/tours',(req,res)=>{
//     // console.log(req.body);
//     // res.send('done');
//     const newId=tour[tour.length-1].id+1;
//    const newTour= Object.assign({id:newId},req.body);
//    tour.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tour),err=>{
//         res.status(201).json({
//             data:{
//                 tours:tour
//             }
//         })
//     })
//  })   
// app.patch('/api/v1/tours/:id',(req,res)=>{
//    const id=req.params.id*1;
//    const updateDuration=req.body.duration;
//    const tourUpdate=tour.find(el=>el.id===id);
//    tourUpdate.duration=updateDuration?updateDuration:tourUpdate.duration;
//    res.status(200).json({
//     status:'success',
//     data:
//     {
//         tours:tourUpdate
//     }
//    })
// })
// app.delete('/api/v1/tours/:id',(req,res)=>{
//     const id=req.params.id*1;
//     const deleted=tour.find(el=>el.id===id);
//     if(deleted)
//     {
//         tour=tour.filter(el=>el.id!==id);
//         console.log(tour);
//         res.status(200).json(tour);
//     }
//     else{
//         res.status(404).json({
//             status:"fail",
//             message:" id not found"
//         })
//     }
// })
module.exports=app;

