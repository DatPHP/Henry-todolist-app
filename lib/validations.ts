import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const todoSchema = z.object({
  content: z.string().min(1, "Task content is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  status: z.string().min(1, "Status is required").default("not_completed"),
  priority: z.string().min(1, "Priority is required").default("Medium"),
  type: z.string().min(1, "Type is required").default("Work"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TodoInput = z.infer<typeof todoSchema>;
