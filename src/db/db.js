import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//DB is a another continant
const connectDB = async()=>{
    try {
       const connectioanInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
       console.log(`\n MONGODB Connected !! DB HOST ${connectioanInstance.connection.host}`);
       
    } catch (error) {
       console.log("MONGODB CONNECTION ERROR",error);
       process.exit(1);
    }
}


export default connectDB;