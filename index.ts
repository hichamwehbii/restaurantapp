import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// MONGO DB
// =======================
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// =======================
// USER SCHEMA
// =======================
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

const User = mongoose.model("User", userSchema);

// =======================
// ORDER SCHEMA
// =======================
const orderSchema = new mongoose.Schema({
  tableId: String,
  items: [
    {
      name: String,
      quantity: Number,
    },
  ],
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

// =======================
// REGISTER
// =======================
app.post("/api/register", async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.json({ message: "User created successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// LOGIN
// =======================
app.post("/api/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login successful",
      name: user.name,
      role: user.role,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// CREATE ORDER (WAITER)
// =======================
app.post("/api/orders", async (req: any, res: any) => {
  try {
    const { tableId, items } = req.body;

    const order = new Order({
      tableId,
      items,
    });

    await order.save();

    res.json({
      message: "Order sent to kitchen",
    });
  } catch {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// =======================
// GET ALL ORDERS (KITCHEN)
// =======================
app.get("/api/orders", async (req: any, res: any) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// =======================
// UPDATE ORDER STATUS
// =======================
app.put("/api/orders/:id", async (req: any, res: any) => {
  try {
    const { status } = req.body;

    await Order.findByIdAndUpdate(req.params.id, {
      status,
    });

    res.json({
      message: "Order updated",
    });
  } catch {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// =======================
// TEST
// =======================
app.get("/", (req: any, res: any) => {
  res.send("Restaurant API Running 🚀");
});

// =======================
// START SERVER
// =======================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});