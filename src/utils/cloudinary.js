import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

//configure the cloudinary

// import {v2 as cloudinary} from 'cloudinary';
import { response } from "express";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET 
});


const uploadOnCloudinary = async (localfilepath)=>{
    try {
        if(!localfilepath) return null;
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type : "auto"
        })
        //file uploaded successfully
        console.log("File uploaded ", response.url);
        fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)//delete from local server
    }
}

export {uploadOnCloudinary};