import express from "express";
import dotenv from "dotenv";

import authRoute from "./routes/authRoute.js"
import { connectToDB } from "./db/conn.js";

const app = express();
dotenv.config();

app.use('/api/auth', authRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    connectToDB();
})