import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGODB connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erro connecting DB ${error.message}`);
        process.exit(1);
    }
}