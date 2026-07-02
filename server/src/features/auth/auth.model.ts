import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "waiter", "chef"],
    default: "waiter",
  },
});

export const User = mongoose.model("User", userSchema);
