import mongoose from "mongoose";
import { userSchema } from "./auth.schema";

export const User = mongoose.model("User", userSchema);
