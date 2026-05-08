import { z } from 'zod';

export const passageCompleteSchema = z.object({
  passageId: z.string().cuid('Invalid passage ID'),
  photoBefore: z.string().url('Invalid photo before URL'),
  photoAfter: z.string().url('Invalid photo after URL'),
  ph: z.number().min(0).max(14),
  chlore: z.number().min(0).max(10),
  temperature: z.number().min(0).max(50),
  note: z.string().optional(),
});

export const stripeWebhookSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
});

export const anomalieCreateSchema = z.object({
  passageId: z.string().cuid(),
  description: z.string().min(10).max(500),
  gravite: z.enum(['HAUTE', 'MOYENNE', 'FAIBLE']),
});

export const devisCreateSchema = z.object({
  tenantId: z.string().cuid(),
  proprietaireEmail: z.string().email(),
  montantHT: z.number().positive(),
  tva: z.number().min(0).max(100),
  description: z.string().optional(),
});

export const tenantProfileSchema = z.object({
  siret: z.string().length(14, 'SIRET must be 14 characters').optional(),
  phone: z.string().regex(/^[+\d\s\-()]+$/).optional(),
  supportEmail: z.string().email().optional(),
});

export const apiKeyCreateSchema = z.object({
  name: z.string().min(1).max(100),
  expirationDays: z.number().min(1).max(365).optional(),
});

export const chatMessageSchema = z.object({
  sessionId: z.string().cuid(),
  message: z.string().min(1).max(1000),
  context: z.enum(['tech', 'client']).optional(),
});

export const devisSignSchema = z.object({
  devisId: z.string().cuid(),
  signature: z.string(), // Base64 image data
  signerName: z.string().min(1).max(100),
});

export const reminderCreateSchema = z.object({
  piscineId: z.string().cuid(),
  frequencyDays: z.number().min(1).max(365),
});

export type PassageComplete = z.infer<typeof passageCompleteSchema>;
export type StripeWebhook = z.infer<typeof stripeWebhookSchema>;
export type AnomalieCreate = z.infer<typeof anomalieCreateSchema>;
export type DevisCreate = z.infer<typeof devisCreateSchema>;
export type TenantProfile = z.infer<typeof tenantProfileSchema>;
export type ApiKeyCreate = z.infer<typeof apiKeyCreateSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type DevisSign = z.infer<typeof devisSignSchema>;
export type ReminderCreate = z.infer<typeof reminderCreateSchema>;
