const mongoose=require('mongoose');
const fs=require('fs');

const Tour=require('./../../tourSchema');
const Review=require('./../../reviewSchema');
const User = require("./../../userSchema");
const dotenv=require('dotenv');
const e = require('express');
const { clear } = require('console');
dotenv.config({path:'./config.env'});
const DB=process.env.DATABASE.replace('<password>',process.env.PASSWORD);
mongoose.connect(DB,{}).then(()=>console.log("Database connected"));

const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));
const importData= async ()=>{
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);
        console.log('Data successfully loaded');
    }
    catch(err)
    {
        console.log(err);
    }
   process.exit();
}
const deleteData= async ()=>{
    try{
        await Tour.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log('data deleted successfully');
    }
    catch(err)
    {
        console.log(err);
    }
    process.exit();
}
console.log(process.argv);

if(process.argv[2]==='--import')
{
    importData();
}
else if(process.argv[2]==='--delete')
{
    deleteData();
}
