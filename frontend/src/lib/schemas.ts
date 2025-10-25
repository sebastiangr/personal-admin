import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().trim().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Debes confirmar la contraseña'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// --- ENUMS COMPARTIDOS ---
// Duplicamos los enums de Prisma como arrays para que Zod los use.
const companyTypes = ['AGENCY_STUDIO', 'TECH_STARTUP', 'SOFTWARE_COMPANY', 'INDUSTRY', 'ECOMMERCE', 'FREELANCE_COLLECTIVE'] as const;
const statuses = ['BACKLOG', 'TO_CONTACT', 'WAITING', 'IN_PROGRESS', 'ARCHIVED', 'HIRED'] as const;

// --- ESQUEMA DE URL REUTILIZABLE ---
// Este es el pre-procesador que limpia y formatea las URLs.
const optionalUrlSchema = z.preprocess((val) => {
  if (typeof val === 'string' && val.length > 0) {
    if (!/^https?:\/\//i.test(val)) {
      return `https://${val}`;
    }
  }
  return val;
}, z.string().url({ message: "URL inválida" }).optional().or(z.literal('')).nullable());


// --- Esquemas de Company ---
export const createCompanySchema = z.object({
  name: z.string().trim().min(1, "El nombre de la compañía es requerido"),
  type: z.enum(companyTypes),
  country: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  email: z.string().email("Email inválido").optional().or(z.literal('')).nullable(),
  website: optionalUrlSchema,
  careerWebsite: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  instagramUrl: optionalUrlSchema,
  behanceUrl: optionalUrlSchema,
  notes: z.string().optional().nullable(),
  interestLevel: z.coerce.number().int().min(1).max(3),  status: z.enum(statuses),
});

// El esquema de actualización hace que todos los campos del de creación sean opcionales
export const updateCompanySchema = createCompanySchema.partial();


// --- Esquemas de Person ---
export const createPersonSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal('')).nullable(),
  linkedinUrl: optionalUrlSchema,
  notes: z.string().optional().nullable(),
});

export const updatePersonSchema = createPersonSchema.partial();


// --- Esquemas de Relación y Parámetros ---
export const assignPersonSchema = z.object({
  personId: z.string().uuid("Formato de ID de persona inválido"),
  role: z.string().trim().optional().nullable(),
});

export const idParamSchema = z.object({
  companyId: z.string().uuid({ message: "Formato de ID de compañía inválido" }),
});