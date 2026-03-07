import mongoose from "mongoose";
import { seedPlans } from "./seeds/planSeed.js";


export const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);

    }
}