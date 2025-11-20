import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDb = async ()=>{
    mongoose.connection.on('connected' , ()=> logger.info("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/zip-drinks`)
}

export default connectDb