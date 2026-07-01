import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import { connectDB } from "./config/db";
import { authRouter } from "./features/auth/auth.router";
import { ordersRouter } from "./features/orders/orders.router";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", authRouter);
app.use("/api/orders", ordersRouter);

app.get("/", (req, res) => {
  res.send("Restaurant API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
