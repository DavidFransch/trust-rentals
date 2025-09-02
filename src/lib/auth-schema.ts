import { z } from "zod"

export const authSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  role: z.enum(["renter", "landlord"]).optional(),
})

export const signInSchema = authSchema.pick({ email: true, password: true })
export const signUpSchema = authSchema.extend({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  role: z.enum(["renter", "landlord"], {
    message: "Role is required",
  }),
})

export type AuthFormData = z.infer<typeof authSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>

export const profileSetupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["renter", "landlord"], { message: "Role is required" }),
  phone: z.string().optional(),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
})

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>
