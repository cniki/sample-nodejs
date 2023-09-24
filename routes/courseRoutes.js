import express from "express"
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllcourses, getCourseLectures } from "../controllers/courseController.js";
import singleUpload from "../Middelware/multer.js";
import { authorizeAdmin, authorizeSubscriber, isAuthenticated } from "../Middelware/auth.js";

const router = express.Router();

//get al courses
router.route("/course").get(getAllcourses);
//create new course
router.route("/createcourse").post(isAuthenticated, authorizeAdmin ,singleUpload ,createCourse);

//add lecture,delete courses,get course detail
router
.route("/course/:id")
.get(isAuthenticated,authorizeSubscriber,getCourseLectures)
.post(isAuthenticated, authorizeAdmin,singleUpload ,addLectures)
.delete(isAuthenticated,authorizeAdmin,deleteCourse);

//delete lecture
router.route("/lecture").delete(isAuthenticated, authorizeAdmin ,deleteLecture);
export default router;