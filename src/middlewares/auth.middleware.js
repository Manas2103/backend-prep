import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
    
        }
    
        // here the second param will be the acces token secret
    
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedInfo._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid access token")
        }
    
        // ceating new object in req to pass user info to req field
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid access token")
    }
})