import { checkUsernameAvailability } from "@/server/auth/actions";
import { z } from "zod";

export const jobFormStep1Schema = z.object({
  title: z.string().min(1, "Job title is required").min(5, "Job title must be at least 5 characters"),
  company: z.string().min(1, "Company name is required"),
  logo: z.union([z.string().url("Invalid URL format"), z.literal("")]).optional()
});

export const jobFormStep2Schema = z.object({
  location: z.string().min(1, "Location is required"),
  salary: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Invalid salary format"),
  expiresAt: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date format"),
  type: z.enum(["Full-time", "Part-time", "Contract", "Freelance"]),
  level: z.enum(["Entry Level", "Mid Level", "Senior Level"]),
  isRemote: z.boolean()
});

export const jobFormStep3Schema = z.object({
  description: z.string().min(1, "Description is required").min(40, "Description must be at least 100 characters"),
  requirements: z.array(z.string().min(1, "Requirement cannot be empty")).min(1, "At least one requirement is needed")
});

export const jobFormStep4Schema = z.object({
  companyDescription: z.string().min(1, "Company description is required").min(40, "Company description must be at least 50 characters")
});

export type JobFormData = z.infer<typeof jobFormStep1Schema 
  & typeof jobFormStep2Schema 
  & typeof jobFormStep3Schema 
  & typeof jobFormStep4Schema>;
  export const emailSchema = z.string()
  .min(1, "")
  .email("Invalid Email Format (proceed with @ and .com)")
  .max(255, "Email is too long")
  .trim()
  .toLowerCase()
  .refine((email) => !email.endsWith(".con"), { message: "Did you mean to write .com?" });

export const passwordSchema = z.string()
  .min(1, "")
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine((password) => !password.includes(" "), { message: "Password cannot contain spaces" });

  export const nameSchema = z
  .string()
  .min(1, "")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces");

  export const usernameSchema = z
  .string()
  .min(1, "")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes");



export const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  firstname: z.string()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Only letters, spaces, apostrophes and hyphens allowed"),
  lastname: z.string()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[A-Za-z\s'-]+$/, "Only letters, spaces, apostrophes and hyphens allowed"),
  username: z.string()
    .min(1, "Username is required")
    .min(3, "Username must be between 3-20 characters")
    .max(20, "Username must be between 3-20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores allowed")
    .refine(async (username) => {
      try {
        return await checkUsernameAvailability(username);
      } catch (error) {
        console.error("Username check failed:", error);
        return false;
      }
    }, "Username is already taken"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters")
    .transform((email) => email.toLowerCase().trim()),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string()
    .min(1, "Confirm Password is required"),
  avatar: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
