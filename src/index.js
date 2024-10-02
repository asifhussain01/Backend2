// require('dotenv').config({path:'./env'})
import dotenv from"dotenv";
import connectDB from "./db/db.js";

dotenv.config({path:'./env'})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is runing at port:${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MOngo db connection failed !!!",err);
    
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