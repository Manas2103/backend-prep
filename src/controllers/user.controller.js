import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message : "ok"
    // })

    // steps to solve the problem of register user are written in the notes file.
    // 1. get the user details....

    const {fullName, email, username, password} = req.body()

    // we cannot handle the files directly.
    // go to router part and include middleware multer.

    // 2. validate the data.

    // we can do this individually but better approach is to use some over array of this things, which return true or false for a condition for all the elements of the array.

    if([fullName, email, username, password].some((field)=> field?.trim() === "" )){
        // use apiError wrapper for throwing error
        throw new ApiError(400, "All fields are required")
    }

    // we can create validation for email pattern

    // Now check whether the user already exists or not.
    //For this import the User schema from models

    const existedUser = User.findOne({
        //write the field through which we want to check the existence.
        // use $or operator to evaluate whole array of fields with OR condition.

        $or : [{username}, {email}]
    })

    if(!existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // now take file paths from the multer

    // req.files is extended by the multer which gives us the file path in our server.

    // check wheteher file exist while chaining

    const avatarLocalPath = req.files?.avatar[0]?.path;

    const coverImagePath = req.files?.image[0]?.path;

    // check avatar path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // upload to cloudinary 

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage =await uploadOnCloudinary(coverImagePath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    // create the data on db, create user object

    const user = await User.create({
        fullName,
        email,
        avatar : avatar.url,
        coverImage : coverImage.url,
        username : username.toLowerCase(),
        password
    })

    // check user created or not plus remove the password and refreshToken fields

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
        //space is necessary to mention what to not select
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // crafting the response
    // with the help of ApiResponse

    return res.status(200).json(
        // create object of apiResponse
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser};