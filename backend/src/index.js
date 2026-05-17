// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config();

const startServer = async () => {
    try {
        // Hum database ko background mein daal rahe hain taaki server na ruke
        connectDB()
            .then(() => console.log("Database response received!"))
            .catch((e) => console.log("Database delay:", e.message));
        
        const port = process.env.PORT || 8000; 
        
        app.listen(port, () => {
            console.log(`\n ⚙️  Server is running at port : ${port}`);
        });
    } catch (err) {
        console.log("Server error: ", err);
    }
};

startServer();

/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/
