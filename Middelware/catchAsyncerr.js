export const catchAsyncerr = (passedFuction)=>(req,res,next)=>{
    Promise.resolve(passedFuction(req,res,next)).catch(next);
}