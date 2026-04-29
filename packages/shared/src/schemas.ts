import { z } from "zod";

// ---- Auth Schemas ----

export const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
  rememberMe: z.boolean().optional().default(false),
});

export const RegisterSchema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[a-z]/, "Au moins une minuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string(),
    firstName: z.string().min(1, "Prénom requis").max(50),
    lastName: z.string().min(1, "Nom requis").max(50),
    phone: z
      .string()
      .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Format: +33 6 XX XX XX XX")
      .optional()
      .or(z.literal("")),
    acceptTerms: z.boolean().refine((v) => v === true, "Vous devez accepter les conditions"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[a-z]/, "Au moins une minuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// ---- Member Schemas ----

export const CreateMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "non_binary", "prefer_not_to_say"]).optional(),
  membershipPlanId: z.string().uuid(),
  contractStart: z.string(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;

// ---- Class Schemas ----

export const CreateClassSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.string().min(1),
  durationMinutes: z.number().int().min(15).max(480),
  maxCapacity: z.number().int().min(1).max(500),
  scheduledAt: z.string().datetime(),
  coachId: z.string().uuid().optional(),
  room: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
});

export type CreateClassInput = z.infer<typeof CreateClassSchema>;

// ---- Booking Schemas ----

export const CreateBookingSchema = z.object({
  classId: z.string().uuid(),
  memberId: z.string().uuid(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
