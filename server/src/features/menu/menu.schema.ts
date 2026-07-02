import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  category: z.string().trim().min(1),
  available: z.boolean().optional(),
});
