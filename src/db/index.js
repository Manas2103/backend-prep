import mongoose from "mongoose";
import {DB_NAME} from "./../constants.js";

const connectDB = async() => {
    try{
        //connecinstance variable ia an object type as mongoose.connect returns an object
        const conninstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`mongoDB connected !! DB HOST : ${conninstance.connection.host}`);
    }
    catch(error){
        console.log("Mongodb connection failed:", error);
        process.exit(1);
    }
}


export default connectDB;