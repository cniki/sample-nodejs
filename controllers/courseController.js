import { catchAsyncerr } from "../Middelware/catchAsyncerr.js";
import {Course} from "../model/Course.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from 'cloudinary'
import {Stats} from '../model/stats.js'

export const getAllcourses= catchAsyncerr(async (req,res,next)=>{

    const keyword = req.query.keyword  || "";
    const category = req.query.category || "";
   
    const courses = await Course.find(
        {
            title:{
                $regex:keyword,
                $options:'i',
                
            },
            category:{
                $regex:category,
                $options:'i',
            }
        }
    ).select("-lectures");

    res.status(200).json({
        success:true,
        courses,
    });

    
});

export const createCourse= catchAsyncerr(async (req,res,next)=>{
   
    const {Title,description,category,createdBy} = req.body;

    if(!Title || !description || !category || !createdBy) 
    return next(new ErrorHandler("Please add all fields",400));

    const file = req.file;
    
    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);


    await Course.create({
        Title,
        description,
        category,
        createdBy,
        poster:{
            public_id:mycloud.public_id,
            url: mycloud.secure_url,
        }
    })
    res.status(201).json({
        success:true,
        message:"course created successfully, you can add lectures now"
    });
});

export const getCourseLectures= catchAsyncerr(async (req,res,next)=>{
   
    const course = await Course.findById(req.params.id);

    if(!course) return next(new ErrorHandler("course not found",404));

    course.views+=1;

    await course.save();
    
    res.status(200).json({
        success:true,
        lectures:course.lectures,
    });
});

//max video size 100 mb
export const addLectures= catchAsyncerr(async (req,res,next)=>{
    const {id} = req.params;
   const {title,description} = req.body;
   //const file = req.file;

    const course = await Course.findById(id);

    if(!course) return next(new ErrorHandler("course not found",404));

    const file = req.file;
    
    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
        resourse_type:"images",
    });

   course.lectures.push({
    title,
    description,
    video: {
      public_id:mycloud.public_id,
        url:mycloud.secure_url,
    },
   })
   course.numofVideos =course.lectures.length;

    await course.save();
    
    res.status(200).json({
        success:true,
        message:"lecture added in course",
    });
});



export const deleteCourse= catchAsyncerr(async (req,res,next)=>{
    const {id} = req.params;

    const course = await Course.findById(id);

    await cloudinary.v2.uploader.destroy(course.poster.public_id);

    for(let i=0;i <course.lectures.length;i++){
        const singlelecture = course.lectures[i];

        await cloudinary.v2.uploader.destroy(singlelecture.video.public_id,{
            resource_type:"image",
        });
    }

    await course.remove();
   
    if(!course) return next(new ErrorHandler("course not found",404));

    
    res.status(200).json({
        success:true,
        message:"course deleted successfully",
    });
});

export const deleteLecture= catchAsyncerr(async (req,res,next)=>{
    const {courseId, lectureId} = req.query;

    const course = await Course.findById(courseId);
   
    if(!course) return next(new ErrorHandler("course not found",404));

    const lecture = course.lectures.find((item)=>{
        if(item._id.toString()!==lectureId.toString()) return item;
    })

    await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
        resource_type:"image",
    });

    course.lectures = course.lectures.filter((item)=>{
        if(item._id.toString()!==lectureId.toString()) return item;
    })
    course.numofVideos = course.lectures.length;

 await course.save();    

    res.status(200).json({
        success:true,
        message:"lecture deleted successfully",
    });
});

Course.watch().on("change",async()=>{
    const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(1);

    const courses= await Course.find({});

    let totalViews=0;

    for(let i=0;i<courses.length;i++){

        totalViews += courses[i].views;
    }

    stats[0].views=totalViews;
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();

})

