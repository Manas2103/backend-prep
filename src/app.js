import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
    //and many more options explore the docs
}));
//SETTING THE middlewares for EXPRESS FOR THE DATA COMING FROM DIFERENT SOURCES

//to set the json file size limit we use
app.use(express.json({limit: '16kb'}));

//to config the data coming from the URL.
app.use(express.urlencoded({extended:true, limit : '16kb'}));

//config for the media files kept inside the public
app.use(express.static("public"));

//config for the cookies, so that we can perform CRUD operations on the users browser saved cookies.
app.use(cookieParser());

export { app };