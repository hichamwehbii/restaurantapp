import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema({
  tableId: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Ready", "Served"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
