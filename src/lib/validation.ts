import { z } from "zod";

const text = z.string().trim().min(1).max(200);
const paragraph = z.string().trim().min(1).max(5000);
const optionalText = z.string().trim().max(5000).nullable();
const count = z.number().int().min(0).max(2147483647);
const duration = count.min(1);
const mediaPath = z.string().max(500).regex(/^\/images\/(?!.*(?:\.\.|[\\?#]))[a-zA-Z0-9_./ -]+\.(?:jpe?g|png|webp)$/i, "Pilih gambar lokal dari pustaka media.");
export const locationSchema = z.enum(["MAKKAH", "MADINAH", "JABAL", "AL_ULA"]);
export const loginSchema = z.object({ username: text, password: z.string().min(1).max(200) });
export const packageUpdateSchema = z.object({
  isActive: z.boolean().optional(), imageUrl: mediaPath.optional(), name: text.optional(),
  tagline: optionalText.optional(), description: paragraph.optional(),
  variantUpdates: z.array(z.object({ variantId: text, price: count.optional(), durationMinutes: duration.optional(), editedPhotosCount: count.optional() })).min(1).max(100).optional(),
}).refine(value => Object.keys(value).length > 0, "Tidak ada perubahan.")
  .refine(value => !value.variantUpdates || new Set(value.variantUpdates.map(v => v.variantId)).size === value.variantUpdates.length, "Varian duplikat.");
export const portfolioCreateSchema = z.object({ title: text, location: locationSchema, mediaUrl: mediaPath, caption: optionalText.optional(), clientConsent: z.boolean().default(false), isFeatured: z.boolean().default(false) });
export const portfolioUpdateSchema = portfolioCreateSchema.partial().extend({ clientConsent: z.boolean().optional(), isFeatured: z.boolean().optional(), isActive: z.boolean().optional() });
export const testimonialCreateSchema = z.object({ clientName: text, originCity: z.string().trim().max(200).nullable().optional(), packageTaken: text, rating: z.number().int().min(1).max(5).default(5), comment: paragraph, consentGiven: z.boolean().default(false) });
export const testimonialUpdateSchema = z.object({ isApproved: z.boolean().optional(), consentGiven: z.boolean().optional() });
export const settingsSchema = z.object({
  companyName: text.optional(), tagline: paragraph.optional(), whatsappNumber: z.string().regex(/^[1-9]\d{7,14}$/).optional(),
  emailAddress: z.email().max(254).optional(), instagramHandle: z.string().regex(/^[a-zA-Z0-9_.]{1,30}$/).optional(),
  tiktokHandle: z.string().regex(/^[a-zA-Z0-9_.]{1,30}$/).optional(), address: paragraph.optional(),
  meetingPointNabawi: text.optional(), meetingPointHaram: text.optional(), meetingPointJabal: text.optional(),
  dpPercentage: z.number().int().min(0).max(100).optional(), announcementText: optionalText.optional(),
  heroImageUrl: mediaPath.nullable().optional(), aboutImageUrl: mediaPath.nullable().optional(),
});
export const trackingSchema = z.object({ packageName: text, variantLabel: text, price: count, location: text });
