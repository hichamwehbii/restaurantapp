import dns from "dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

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

const orderSchema = new mongoose.Schema({
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

const Order = mongoose.model("Order", orderSchema);

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

app.post("/api/orders", async (req: any, res: any) => {
  try {
    const { tableId, items } = req.body;

    const existingOrder = await Order.findOne({
      tableId,
      status: { $ne: "Served" },
    });

    if (existingOrder) {
      items.forEach((newItem: any) => {
        const oldItem = existingOrder.items.find(
          (item: any) => item.name === newItem.name
        );

        if (oldItem) {
          oldItem.quantity += newItem.quantity;
        } else {
          existingOrder.items.push(newItem);
        }
      });

      existingOrder.status = "Pending";
      await existingOrder.save();

      return res.json({
        message: "Items added to existing order",
        order: existingOrder,
      });
    }

    const order = new Order({
      tableId,
      items,
      status: "Pending",
    });

    await order.save();

    res.json({
      message: "Order sent to kitchen",
      order,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/orders", async (req: any, res: any) => {
  try {
    const orders = await Order.find({
      status: { $ne: "Served" },
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/orders/:id", async (req: any, res: any) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Order updated",
      order,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/orders/:id", async (req: any, res: any) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    res.json({
      message: "Order deleted",
      order,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req: any, res: any) => {
  res.send("Restaurant API Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});