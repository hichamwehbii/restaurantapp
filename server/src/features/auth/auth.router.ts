import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "./auth.model";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
