import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary';

import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import connectToDB from "./db/conn.js";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    connectToDB();
})