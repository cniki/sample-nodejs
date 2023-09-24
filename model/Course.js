import mongoose from "mongoose";

const schema = new mongoose.Schema({
    Title:{
        type:String,
        required:[true,"Please enter course title"],
        minLength:[4,"title  must be 4 length"],
        maxLength:[80,"title  cannot exceed 80 characters length"],
    },
    description:{
        type:String,
        required:[true,"Please enter course description"],
        minLength:[20,"atleat 20 character desctription"],
       
    },
    lectures:[
        {
            title:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            video:{
                public_id:{
                    type:String,
                    required:true
                },
                url:{
                    type:String,
                    required:true
                }
            },
        }
    ],
    poster:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    views:{
        type:Number,
        default:0,
    },
    numofVideos:{
        type:Number,
        default:0,

    },
    category:{
        type:String,
        required:true

    },
    createdBy:{
        type:String,
        required:[true,"Enter course creator nam"],

    },
    createAt:{
        type:Date,
        deafult:Date.now,
    },

});

export const Course = mongoose.model("Course",schema);
