import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        // console.log(user);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // console.log(accessToken)
        // console.log(refreshToken)
        user.refreshToken = refreshToken
        await user.save({validteBeforeSave : false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating acesstoken")
    }
} 

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message : "ok"
    // })

    // steps to solve the problem of register user are written in the notes file.
    // 1. get the user details....

    const {fullName, email, username, password} = req.body
    console.log("email :", email)
    console.log("userName", username);
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

    // const existedUser = await User.findOne({
    //     //write the field through which we want to check the existence.
    //     // use $or operator to evaluate whole array of fields with OR condition.

    //     $or : [{username}, {email}]
    // })

    const existedUser = await User.findOne({
        $or : [{ username }, { email }]
    })

    console.log(existedUser);

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // now take file paths from the multer

    // req.files is extended by the multer which gives us the file path in our server.

    // check wheteher file exist while chaining

    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverImagePath = req.files?.coverImage[0]?.path;

    // applying classic if else for checking...
    let coverImagePath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImagePath = req.files.coverImage[0].path;
    }

    // let avatarLocalPath;
    // if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
    //     avatarLocalPath = req.files.avatar[0];
    // }



    // check avatar path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    // upload to cloudinary 

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    // create the data on db, create user object

    const user = await User.create({
        fullName,
        email,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
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

const loginUser = asyncHandler( async (req, res) => {
    // Steps : 
    // data from req
    // check for username or email(imp).
    // Find the user
    // check for password
    // access and refresh token
    // send tokens in form of secure cookies
    // send res.

    const {username, email, password} = req.body

    if(!username && !email){
        throw new ApiError(400, "username or password is required")
    }

    const user = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    // here for methods calling of user models we will not use User as its an object of mongoose, 
    // but the methids we made are accessible through our instance of User i.e. "user".

    // check password

    const isPassValid = await user.isPasswordCorrect(password)

    if(!isPassValid){
        throw new ApiError(401, "Password incorrect")
    }

    // create access and refresh tokens
    // create one method
    
    const {refreshToken, accessToken} = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // send response with cookies.
    // for cookies we need to give options such that only server can modify the cookie not the client.

    //options
    const option = {
        httpOnly : true,
        secure : true
    }
    // cookie("keyname", value, options)
    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, refreshToken, accessToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id

    await User.findByIdAndDelete(
        userId,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const option = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged Out"
        )
    )
})

export {registerUser, loginUser, logoutUser};