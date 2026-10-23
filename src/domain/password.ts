import { z } from 'zod'

export const passwordRules = z
  .string()
  .min(12, 'Use at least 12 characters.')
  .max(128, 'Use no more than 128 characters.')
  .regex(/[a-z]/, 'Include a lowercase letter.')
  .regex(/[A-Z]/, 'Include an uppercase letter.')
  .regex(/[0-9]/, 'Include a number.')
