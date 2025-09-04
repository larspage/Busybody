import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Sentry DSN format validation - strict in production, optional in dev/test
const sentryDsnSchema = z.union([
  z.string()
    .url()
    .regex(
      /^https:\/\/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.ingest\.sentry\.io\/[0-9]+$/,
      'Invalid Sentry DSN format'
    ),
  z.string().length(0),
  z.undefined()
]);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  SALT_ROUNDS: z.string().transform(Number).default('10'),
  SENTRY_DSN: sentryDsnSchema,
  SENTRY_ENVIRONMENT: z.string().optional(),
  SENTRY_RELEASE: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_API_KEY: z.string().min(1, 'SUPABASE_API_KEY is required'),
});

const envVars = envSchema.parse(process.env);

export const config = {
  environment: envVars.NODE_ENV,
  port: envVars.PORT,
  database: {
    url: envVars.DATABASE_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    saltRounds: envVars.SALT_ROUNDS,
  },
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
  supabase: {
    url: envVars.SUPABASE_URL,
    apiKey: envVars.SUPABASE_API_KEY,
  },
} as const;

// Type for the config object
export type Config = typeof config;