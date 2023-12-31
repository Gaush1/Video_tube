// require('dotenv').config({path: './env'})

import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { DB_NAME } from './constants';
import connectDB from './db/index.js';
import {app} from './app.js'

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Listening on PORT: http://localhost:${process.env.PORT}`)
    })
})
.catch((error)=>console.log("MongoDb connection failed !!! ", error))

app.get('/',(req,res)=>{
res.send("Hello World");
})

/*
import express from 'express';
const app = express();

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Errore: ",error);
            throw error;
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`Listening on ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("Error: ",error)
        throw error;
    }
})();
*/