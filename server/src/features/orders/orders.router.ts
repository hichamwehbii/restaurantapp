import { Router } from "express";
import { Order } from "./orders.model";

export const ordersRouter = Router();

ordersRouter.post("/", async (req, res) => {
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

ordersRouter.get("/", async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $ne: "Served" },
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

ordersRouter.put("/:id", async (req, res) => {
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

ordersRouter.delete("/:id", async (req, res) => {
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
