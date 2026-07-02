import { Router } from "express";
import { MenuItem } from "./menu.model";
import { createMenuItemSchema } from "./menu.schema";

export const menuRouter = Router();

menuRouter.get("/", async (_req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

menuRouter.post("/", async (req, res) => {
  try {
    const parsedBody = createMenuItemSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ message: "Invalid menu item data" });
    }

    const { name, price, category, available } = parsedBody.data;

    const menuItem = new MenuItem({
      name,
      price,
      category,
      available: available ?? true,
    });

    await menuItem.save();

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});
