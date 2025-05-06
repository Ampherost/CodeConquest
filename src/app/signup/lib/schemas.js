import { z } from 'zod';

const passwordRequirements = z.string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character");

// employer schema
export const businessSchema = z.object({
  business_name: z.string().min(5, "Business name is required"),
  business_email: z.string().email("Invalid business email"),
  password: passwordRequirements,
  confirm_password: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirm_password"],
    });
  }
});

// candidate schema
export const candidateSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordRequirements,
  confirm_password: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirm_password"],
    });
  }
});
