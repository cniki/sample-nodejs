import express from "express"
import { addToPlaylist, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, login, 
 logout, 
 register, 
 removeFromPlaylist, 
 resetPassword, 
 updateProfile,
 updateProfilepic,
 updateUserRole} 
from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../Middelware/auth.js";
import singleUpload from '../Middelware/multer.js'

const router = express.Router();
//to register a new user
router.route("/register").post(singleUpload, register);

//login
router.route("/login").post(login);
//logout
router.route("/logout").get(logout);
//get my profile
router.route("/me").get(isAuthenticated, getMyProfile);
//delete my profile
router.route("/me").delete(isAuthenticated,deleteMyProfile);
//change password
router.route("/changepassword").put(isAuthenticated, changePassword);
//update profile
router.route("/updateProfile").put(isAuthenticated, updateProfile);
//update profilepic
router.route("/updateProfilepic").put(isAuthenticated, singleUpload, updateProfilepic);
//forget password
router.route("/forgetPassword").post(forgetPassword);
//reset password
router.route("/resetpassword/:token").put(resetPassword);

//add to playlist
router.route("/addToPlaylist").post(isAuthenticated, addToPlaylist);
//removefromplaylist
router.route("/removFromPlaylist").delete(isAuthenticated, removeFromPlaylist);
// admin routes get all users

router.route("/admin/users").get(isAuthenticated,authorizeAdmin,getAllUsers);

router
.route("/admin/user/:id")
.put(isAuthenticated,authorizeAdmin,updateUserRole)
.delete(isAuthenticated,authorizeAdmin,deleteUser);



export default router;