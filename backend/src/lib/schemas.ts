import { z } from 'zod';

// --- Auth Schema ---
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});


// --- Company Schema ---
import { CompanyType, Status } from '@prisma/client';

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  type: z.enum(CompanyType).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  email: z.email("Invalid email address").optional().or(z.literal('')),
  website: z.url("Invalid URL").optional().or(z.literal('')),
  careerWebsite: z.url("Invalid URL").optional().or(z.literal('')),
  linkedinUrl: z.url("Invalid URL").optional().or(z.literal('')),
  instagramUrl: z.url("Invalid URL").optional().or(z.literal('')),
  behanceUrl: z.url("Invalid URL").optional().or(z.literal('')),
  notes: z.string().optional(),
  interestLevel: z.number().int().min(1).max(3).optional(),
  status: z.enum(Status).optional(),
});

export const updateCompanySchema = createCompanySchema.partial();


// --- Person Schema ---
export const createPersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().optional().or(z.literal('')),
  linkedinUrl: z.url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const updatePersonSchema = createPersonSchema.partial();


// --- Person Assing Schema ---
export const assignPersonSchema = z.object({
  personId: z.uuid("Invalid Person ID format"),
  role: z.string().optional(),
});