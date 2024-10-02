import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

//for files data aa rha hai
app.use(express.json({limit:"10kb"}))
//for url se data aa rha hai
app.use(express.urlencoded({extended:true,limit:"10kb"}))
// public assest
app.use(express.static("public"))

app.use(cookieParser())

export {app}