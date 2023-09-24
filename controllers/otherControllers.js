import { catchAsyncerr } from "../Middelware/catchAsyncerr.js";
import {sendEmail} from '..//utils/sendEmail.js'
import ErrorHandler from "../utils/ErrorHandler.js";
import { Stats } from "../model/stats.js";


export const contact = catchAsyncerr(async(req,res,next)=>{

    const {name,email,message}=req.body;
     if(!name || !email || !message) return next(new ErrorHandler("all fields are mendatory",404))
    const to=process.env.MY_MAIL;
    const subject ="contact from course ";
    const text=`i am ${name} and my email is ${email}. \n${message}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
        success:true,
        message:"your message has been sent."
    });
});
export const courseRequest = catchAsyncerr(async(req,res,next)=>{
    const {name,email,course}=req.body;

    const to=process.env.MY_MAIL;
    const subject ="request for a course on course";
    const text=`i am ${name} and my email is ${email}. \n${course}`;

    await sendEmail(to, subject, text);

        res.status(200).json({
        success:true,
        message:"your request has been sent."
    });
});
export const getDashboardStats = catchAsyncerr(async(req,res,next)=>{
    const stats = await Stats.find().sort({createdAt:"desc"}).limit(12);

    const statsData=[];
   
    for(let i=0;i<stats.length;i++){
        statsData.push(stats[i]);

    }
    const requiredSize= 12-stats.length;

    for(let i=0;i<requiredSize;i++){
        statsData.unshift({
            users:0,
            subscriptions:0,
            views:0
        });

    }

    const usersCount=statsData[11].users;
    const subscriptionsCount=statsData[11].subscriptions;
    const viewsCount=statsData[11].views;

    let usersPrercentage=0,
    viewsPrercentage=0,
    subscriptionsPrercentage=0;

    let usersProfit=true,
    viewsProfit=true,
    subscriptionsProfit=true;

    if(statsData[10].users===0) usersPrercentage=usersCount*100;
    if(statsData[10].views===0) viewsPrercentage=viewsCount*100;
    if(statsData[10].subscriptions===0) subscriptionsPrercentage=subscriptionsCount*100;

    else{
        const difference = {
            users:statsData[11].users-statsData[10].users,
            views:statsData[11].views-statsData[10].views,
            subscriptions:statsData[11].subscriptions-statsData[10].subscriptions,
        };

        usersPrercentage=(difference.users/statsData[10].users)*100;
        viewsPrercentage=(difference.views/statsData[10].views)*100;
        subscriptionsPrercentage=(difference.subscriptions/statsData[10].subscriptions)*100;
        if(usersPrercentage<0)usersProfit=false;
        if(viewsPrercentage<0)viewsProfit=false;
        if(subscriptionsPrercentage<0)subscriptionsProfit=false;
    }

    res.status(200).json({
        success:true,
        stats:statsData,
        usersCount,
        subscriptionsCount,
        viewsCount,
        subscriptionsPrercentage,
        usersPrercentage,
        viewsPrercentage,
        subscriptionsProfit,
        usersProfit,
        viewsProfit,
    });
});