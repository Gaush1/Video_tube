import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

//CORS=>Cross Origin Resource Sharing
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit:"16kb"})); // Build-in middleware to convert req.body into json

app.use(express.urlencoded({extended: true, limit: "16kb"})); // Build-in middleware to read data from url.

app.use(express.static("public")); // Build-in middleware to read static files

app.use(cookieParser()); // Third party middleware to perform operations on cookies

export { app }  