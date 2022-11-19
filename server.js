const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const mongoose=require('mongoose');
const app=require('./app');
const DB=process.env.DATABASE.replace('<password>',process.env.PASSWORD);
mongoose.connect(DB,{
   
    
}).then(()=>console.log('Database Connected')).catch(err=>console.log(err));
const port=process.env.PORT;


// const testTour=new Tour({
//     name:'Forest Hiker',
//     rating:4.7,
//     price:400
// });
// testTour.save().then(doc=>console.log(doc)).catch(err=>console.log('Error',err));





app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})
    
