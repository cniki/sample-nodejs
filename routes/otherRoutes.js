import express from "express"
import { authorizeAdmin, isAuthenticated } from "../Middelware/auth.js";
import { contact, courseRequest,  getDashboardStats  } from "../controllers/otherControllers.js";

const router = express.Router();
//contact r
router.route("/contact").post(contact);
//req Form
router.route("/coursereq").post(courseRequest)
//get admindashbourd stat
router.route("/admin/stats").get(isAuthenticated,authorizeAdmin, getDashboardStats )

export default router;