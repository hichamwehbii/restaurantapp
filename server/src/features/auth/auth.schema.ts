import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "waiter", "chef"],
    default: "waiter",
  },
});
