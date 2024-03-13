import mongoose, {Schema} from mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
//for aggregate queries
const videoSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true,
            index : true // for search 
        },
        videoFile : {
            type : String, //cloudinary string
            required : true,
        },
        thumbnail : {
            type : String, //cloudinary string
            required : true,
        },
        description : {
            type : String,
            required : true,
        },
        duration : {
            type : Number,//from cloudinary 
            required : true,
        },
        views : {
            type : Number,
            default:0
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        }

    },
    {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)//mongoose aggregation pipe line

export const Video = mongoose.model("Video", videoSchema)