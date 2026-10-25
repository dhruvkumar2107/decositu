import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password is too long.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.").max(254);
const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, "").replace(/^\+91/, ""))
  .pipe(z.string().regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit Indian mobile number."));

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password.").max(72),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((value) => (value ? value.replace(/[\s-]/g, "").replace(/^\+91/, "") : null))
    .refine((value) => value === null || /^[6-9][0-9]{9}$/.test(value), {
      message: "Enter a valid 10-digit Indian mobile number.",
    }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password.").max(72),
  newPassword: passwordSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, "This reset link is invalid."),
  password: passwordSchema,
});

export const addressSchema = z.object({
  label: z.string().trim().min(1).max(30).default("Home"),
  fullName: z.string().trim().min(2, "Enter the full name.").max(100),
  phone: phoneSchema,
  line1: z.string().trim().min(5, "Enter the street address.").max(160),
  line2: z.string().trim().max(160).optional().default(""),
  city: z.string().trim().min(2, "Enter the city.").max(80),
  state: z.string().trim().min(2, "Enter the state.").max(80),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code."),
  isDefault: z.boolean().optional().default(false),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10),
});

export const createOrderSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  fullName: z.string().trim().min(2, "Enter the full name.").max(100),
  line1: z.string().trim().min(5, "Enter the street address.").max(160),
  line2: z.string().trim().max(160).optional().default(""),
  city: z.string().trim().min(2, "Enter the city.").max(80),
  state: z.string().trim().min(2, "Enter the state.").max(80),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code."),
  notes: z.string().trim().max(500).optional().default(""),
  couponCode: z.string().trim().max(40).optional().default(""),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  items: z.array(orderItemSchema).min(1, "Your bag is empty.").max(25),
});

export const couponCodeSchema = z.object({
  code: z.string().trim().min(2).max(40),
  subtotal: z.coerce.number().int().min(0),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(100).optional().default(""),
  body: z.string().trim().min(10, "Tell us a little more about your experience.").max(1000),
});

export const newsletterSchema = z.object({
  email: emailSchema,
  consent: z.boolean().refine((value) => value === true, {
    message: "Please agree to receive emails.",
  }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens.").max(160),
  sku: z.string().trim().min(2).max(60),
  categoryId: z.string().min(1),
  description: z.string().trim().min(20).max(4000),
  story: z.string().trim().max(1000).optional().default(""),
  price: z.coerce.number().int().min(1),
  compareAtPrice: z.coerce.number().int().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  images: z.string().trim().min(1),
  material: z.string().trim().min(2).max(300),
  dimensions: z.string().trim().min(2).max(300),
  care: z.string().trim().min(2).max(1000),
  badge: z.string().trim().max(30).optional().default(""),
  featured: z.boolean().optional().default(false),
  newArrival: z.boolean().optional().default(false),
  bestseller: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(90),
  description: z.string().trim().min(5).max(400),
  image: z.string().trim().min(1).max(300),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{3,30}$/),
  description: z.string().trim().min(3).max(200),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().int().min(1),
  minSubtotal: z.coerce.number().int().min(0),
  maxDiscount: z.coerce.number().int().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().min(1).optional().nullable(),
  active: z.boolean().optional().default(true),
  expiresAt: z.string().trim().optional().default(""),
});
