import dns from "dns";
import mongoose from "mongoose";
import { MONGO_URI } from "./env";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.log("MongoDB Error:", message);
  }
};
