const mongoose=require("mongoose");
const fs=require("fs");
const Tour=require('../../Models/tourModel');
const User=require('../../Models/userModel');
const Review=require('../../Models/reviewModel');
const dotenv=require("dotenv");
dotenv.config({path:'./config.env'});


const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then();

//Read the file
const toursData=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const usersData=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviewsData=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))
//import the data to the DB
exports.importData=async()=>{
    try{
        await Tour.create(toursData);
        await User.create(usersData,{validateBeforeSave:false});
        await Review.create(reviewsData);
        console.log("Data Created Succefully")
    }
    catch(err){
        console.log(err)
    }
    process.exit()
}

exports.deleteData=async()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data Deleted Succefully")
        
    }
    catch(err){
        console.log(err)
    }
    process.exit()
}

if (process.argv[2]==="--import"){
    importData();
}
else if(process.argv[2]==="--delete"){
    deleteData();
}