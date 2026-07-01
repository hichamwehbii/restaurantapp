import mongoose from "mongoose";
import { menuItemSchema } from "./menu.schema";

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
