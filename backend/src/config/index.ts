import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  SENTRY_DSN: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().optional(),
});

const envVars = envSchema.parse(process.env);

export const config = {
  environment: envVars.NODE_ENV,
  port: envVars.PORT,
  sentry: {
    dsn: envVars.SENTRY_DSN,
  },
  axiom: {
    token: envVars.AXIOM_TOKEN,
    dataset: envVars.AXIOM_DATASET,
  },
} as const;