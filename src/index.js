// require('dotenv').config({path:'./env'})
import dotenv from"dotenv";
import connectDB from "./db/db.js";
import {app} from './app.js'

dotenv.config({path:'./env'})

const port =process.env.PORT||8000

connectDB()
.then(()=>{
    app.listen(port||3001,()=>{
        console.log(`⚙️  Server is runing at port:${port}`);
        
    })
})
.catch((error)=>{
    console.log("Mongo db connection failed !!!",error);
    
})



//  First Approch 

// import mongoose from "mongoose"
// import { DB_NAME } from "./constants";
// import express from "express"

// const app = express()

// // efi   first : lagana is good practice
// //data base connection
// ;(async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGOOSE_URL}/${DB_NAME}`)
//        //for listen 
//        app.on("error",(error)=>{
//         console.log("ERR:",error);
//         throw console.error();
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`);
        
//        })
//     } catch (error) {
//         console.error("ERROR:",error);
//         throw err
//     }
// })()