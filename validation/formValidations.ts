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