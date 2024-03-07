//require('dotenv').config({path : './env'})
//this syntax of confuguring dotenv will work but the consistency of the code is disrupted

import dotenv from "dotenv"
import {app} from "./app.js"

import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import express from "express";
import connectDB from "./db/index.js"

//new method, for this we add something in the package.json file i.e. in dev script ("dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js")
dotenv.config({
    path : "./env"
})


//this is the second approach:
connectDB()
.then(()=> {
    app.on('error',(error) => {
        console.log("ERROR : ", error);
        throw error;
    })
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Error in mongoDB connection: ", error);
})

//this is the first approach where we can create iffy we will use seccond approach

/*

const app = express();
(async() => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error',(error) => {
            console.log("ERROR : ", error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.log("ERROR:", error);
    }
})()

*/
