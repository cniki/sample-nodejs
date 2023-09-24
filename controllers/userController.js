import { catchAsyncerr } from "../Middelware/catchAsyncerr.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {User} from "../model/User.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {Course} from '../model/Course.js'
import cloudinary from 'cloudinary'
import getDataUri from '../utils/dataUri.js'
import {Stats} from '../model/stats.js'

export const register = catchAsyncerr(async(req,res,next)=>{
    const file = req.file;
    const {name,email,password}=req.body;

    if(!name || !password || !email || !file)return(new ErrorHandler(
        "please enter all field",400
    ))

    let user = await User.findOne({email});

    if(user)return next(new ErrorHandler("user Already Exist",409));


    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);


    user = await User.create({
        name,email,
        password,
        avtar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        },
    });

   sendToken(res,user,"Registered Successfully",201);
});

//login
export const login = catchAsyncerr(async (req,res,next)=>{

    const {email, password } = req.body;



    if(!email || !password )return(new ErrorHandler(
        "please enter all field",400
    ))

    const user = await User.findOne({ email }).select("+password");

    if(!user) return next(new ErrorHandler("incorrect email or password",401));

    const isMatch = await user.comparePassword(password);

    if(!isMatch)return next(new ErrorHandler("incorrect email or password",401));

   sendToken(res,user,`welcome back,${user.name} `,200);
});

//logout
export const logout = catchAsyncerr(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),

    }).json({
        success:true,
        message:"logged out successfully",
    })
});


//

export const getMyProfile = catchAsyncerr(async(req,res,next)=>{
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success:true,
       user,
    })
});

//change password
export const changePassword = catchAsyncerr(async(req,res,next)=>{
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword )return(new ErrorHandler(
        "please enter all field",400
    ))

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if(!isMatch)return(new ErrorHandler(
        "Incorrect old password",400
    ));

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success:true,
       message:"password changed successfully",
    })
});


export const updateProfile = catchAsyncerr(async(req,res,next)=>{
    const {name, email} = req.body;

    const user= await User.findById(req.user._id);

    const isMatch = await user.comparePassword(oldPassword);

    if(name) user.name=name;
    if(email) user.email= email;
    await user.save();

    res.status(200).json({
        success:true,
       message:"profile updated uccessfully",
    })
});

//update profile picture
export const updateProfilepic = catchAsyncerr(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    //cloudinary
    const file = req.file;

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    await cloudinary.v2.uploader.destroy(user.avtar.public_id);

    user.avtar = {
        public_id:mycloud.public_id,
        url:mycloud.secure_url
    };

    await user.save();

    res.status(200).json({
        success:true,
        message:"Profile picture updated successfully"
    })
});

export const forgetPassword = catchAsyncerr(async(req,res,next)=>{
     
    const {email}=req.body;

    const user = await User.findOne({email});
    if(!user)return next(ErrorHandler("User not found",400));
    const resetToken = await user.getResetToken();

    const url =`${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    const message = `click on the link to reset your password. ${url} if you have not
    requested then please ignore.`
    //Send token via email
    await sendEmail(user.email,"Course Reset Password",message);
    
    res.status(200).json({
        success:true,
        message:`reset Token has been sent to ${user.email}`,
    });
});

export const resetPassword = catchAsyncerr(async(req,res,next)=>{
    //cloudinary to do
    res.status(200).json({
        success:true,
        message:"Profile picture updated successfully"
    })
});

export const addToPlaylist= catchAsyncerr(async(req,res,next)=>{
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id)

    if(!course) return next(new ErrorHandler("Invalid course id",404));

    const itemExist = user.playlist.find((item)=>{
        if(item.course.toString()===course._id.toString()) return true;
    })

    if(itemExist) return next(new ErrorHandler("item already exist",409));
    user.playlist.push({
        course:course._id,
        poster:course.poster.url,
    });
    await user.save();

    res.status(200).json({
        success:true,
        message:"added to playlist"
    })
});

export const removeFromPlaylist= catchAsyncerr(async(req,res,next)=>{
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.query.id)

    if(!course) return next(new ErrorHandler("Invalid course id",404));

    const newPlaylist = user.playlist.filter((item)=>{
        if(item.course.toString()!==course._id.toString()) return item;
    });

    user.playlist = newPlaylist;
  
    
    await user.save();

    res.status(200).json({
        success:true,
        message:"removed from playlist"
    })
});
//ad min controllers get all users
export const getAllUsers = catchAsyncerr(async(req,res,next)=>{
    const users = await User.find({});

    
    res.status(200).json({
        success:true,
        users,
    })
});

export const updateUserRole = catchAsyncerr(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler("User not found",404));

    if(user.role === "user") user.role = "admin";
    else user.role="user";

    await user.save();
    
    res.status(200).json({
        success:true,
        message:"role updated",
    });
});

export const deleteUser = catchAsyncerr(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler("User not found",404));

    await cloudinary.v2.uploader.destroy(user.avtar.public_id);



    await user.remove();
    
    res.status(200).json({
        success:true,
        message:"user deleted successfuly",
    });
});

export const deleteMyProfile = catchAsyncerr(async(req,res,next)=>{
    const user = await User.findById(req.user._id);

    await cloudinary.v2.uploader.destroy(user.avtar.public_id);

//cancel subscription

    await user.remove();
    
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
    }).json({
        success:true,
        message:"user deleted successfuly",
    });
});

User.watch().on("change",async()=>
{
    const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(1);

    const subscriptions = await User.find({"subscriptions.status":"active"});
    stats[0].users=await User.countDocuments();
    stats[0].subscriptions=subscriptions.length;
    stats[0].createdAt = new Date(Date.now());

    await stats.save();
});