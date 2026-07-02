import { z } from "zod";

export const orderItemSchema = z.object({
  name: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(1),
});

export const createOrderSchema = z.object({
  tableId: z.string().trim().min(1),
  items: z.array(orderItemSchema).min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["Pending", "Preparing", "Ready", "Served"]),
});
