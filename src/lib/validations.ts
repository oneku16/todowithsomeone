import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(50),
  password: z.string().min(1, "Password is required"),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  category: z.enum(["WATCH", "GO", "DO"]),
  assignedToId: z.string().min(1, "Assignee is required"),
  dueDate: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  category: z.enum(["WATCH", "GO", "DO"]).optional(),
  assignedToId: z.string().min(1).optional(),
  status: z.enum(["PENDING", "DONE"]).optional(),
  dueDate: z.string().optional().nullable(),
});
