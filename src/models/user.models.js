import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
            index : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
        },
        fullName : {
            type : String,
            required : true,
            trim : true,
            index : true
        },
        avatar : {
            type : String, //claudinary url
            required : true,
        },
        coverImage : {
            type : String, //claudinary url
        },
        watchHistory: [
            {
                type : Schema.Types.ObjectId,
                ref : "video"
            }
        ],
        password: {
            type : String,
            required : [true, 'Password is required'],
        },
        refreshToken:{
            type : String
        }
    },
    {
        timestamps : true
    }
)

//password encryption
userSchema.pre("save", async function(next){
    //checking if modified
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 8)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    //it returns true or false
    return await bcrypt.compare(password, this.password)
}

//genrate access and refresh tokens
userSchema.methods.generateAccessToken = function(){
    //sign creates access tokens.

    return jwt.sign(
        //payload
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullName
            
        },
        //Access toke secret, it is given directly
        process.env.ACCESS_TOKEN_SECRET,
        //expiry, given inside the object
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )

}

userSchema.methods.generateRefreshToken  = function(){
    //sign creates access tokens.
    return jwt.sign(
        //payload, for refresh token, this much payload is not required
        {
            _id : this._id,
        },
        //Access token secret, it is given directly
        process.env.REFRESH_TOKEN_SECRET,
        //expiry, given inside the object
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

export const User = mongoose.model("User", userSchema)