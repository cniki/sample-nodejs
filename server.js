import app from './App.js';
import {config} from "dotenv"
import Razorpay from "razorpay"
import nodeCrone from "node-cron"
import {Stats} from './model/stats.js'
config({
    path:"./config/config.env",
});
import cloudinary from "cloudinary"

import {connectDb} from "./config/Database.js"



connectDb();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET ,
})

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY ,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
nodeCrone.schedule("0 0 0 1 * *",async()=>{
    try{
        await Stats.create({});
    }catch(error){
        console.log(error);
    }
});


app.listen(process.env.PORT,()=>{
    console.log(`server is working on port :${process.env.PORT}`);
})