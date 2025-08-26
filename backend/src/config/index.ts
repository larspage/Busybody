import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Sentry DSN format validation
const sentryDsnSchema = z
  .string()
  .url()
  .regex(
    /^https:\/\/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.ingest\.sentry\.io\/[0-9]+$/,
    'Invalid Sentry DSN format'
  )
  .optional();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  SENTRY_DSN: sentryDsnSchema,
  SENTRY_ENVIRONMENT: z.string().optional(),
  SENTRY_RELEASE: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),
});

const envVars = envSchema.parse(process.env);

export const config = {
  environment: envVars.NODE_ENV,
  port: envVars.PORT,
  sentry: {
    dsn: envVars.SENTRY_DSN,
    environment: envVars.SENTRY_ENVIRONMENT || envVars.NODE_ENV,
    release: envVars.SENTRY_RELEASE,
    enabled: Boolean(envVars.SENTRY_DSN),
    sampleRate: envVars.NODE_ENV === 'production' ? 1.0 : 0.5,
  },
  axiom: {
    token: envVars.AXIOM_TOKEN,
    dataset: envVars.AXIOM_DATASET,
  },
} as const;

// Type for the config object
export type Config = typeof config;