import express from 'express'
import {config} from "dotenv"
import ErrorMiddleware from "./Middelware/Error.js";
import cookieParser from 'cookie-parser'
import cors from 'cors';
config({
    path:"./config/config.env",
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
    extended:true,
})
);
app.use(
    cors
    ({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methos:["GET","POST","DELETE","PUT"],
    })
);
import course from "./routes/courseRoutes.js"
import user from "./routes/userRoutes.js"
import payment from "./routes/paymentRoutes.js"
import other from "./routes/otherRoutes.js"
app.use("/api/v1",course);
app.use("/api/v1",user);
app.use("/api/v1",payment);
app.use("/api/v1",other);
export default app;

app.use(ErrorMiddleware);