import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> =>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
    } catch (error) {
        console.log("mongodb connection error:", error)
        throw error;
    }
}

export default connectDB;