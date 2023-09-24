import express from "express"
import { isAuthenticated } from "../Middelware/auth.js";
import { buySubscription, cancelsubscription, getRazorPayKey, paymentVerification } from "../controllers/paymentContriller.js";
const router = express.Router();

//buy subscription
router.route("/subscribe").get(isAuthenticated,buySubscription);
//payment verification and save reference in db
router.route("/paymentverification").post(isAuthenticated,paymentVerification)
//get razorpaykey RAZORPAY_API_KEY
router.route("/razorPaykey").get(getRazorPayKey);
//cancel subscription
router.route("/subscribe/cancel").delete(isAuthenticated,cancelsubscription);
export default router;