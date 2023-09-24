
import jwt from 'jsonwebtoken'
import { catchAsyncerr } from './catchAsyncerr.js'
import ErrorHandler from '../utils/ErrorHandler.js';
import {User} from '../model/User.js'
export const isAuthenticated = catchAsyncerr(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token) return next(new ErrorHandler("not logged in",401));

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    next();
});

export const authorizeAdmin= (req,res,next)=>{

    if(req.user.role!=='admin') return next(
       new ErrorHandler(`${req.user.role} is not allowed to access the resourse`,403)
        );

        next();


}

export const authorizeSubscriber= (req,res,next)=>{

    if(req.user.subscription.status!=='active' && req.user.role!=='admin') return next(
       new ErrorHandler(`only subscriber can access this`,403)
        );

        next();


}