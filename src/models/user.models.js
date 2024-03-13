import mongoose, {Schema} from mongoose;

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
        fullname : {
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
        refreshTokens:{
            type : String
        }
    },
    {
        timestamps : true
    }
)


export const User = mongoose.model("User", userSchema)