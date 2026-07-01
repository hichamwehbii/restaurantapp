import mongoose from "mongoose";
import { orderSchema } from "./orders.schema";

export const Order = mongoose.model("Order", orderSchema);
