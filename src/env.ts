import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, { message: 'DATABASE_URL is required' }),
  REDIS_URL: z.string().min(1, { message: 'REDIS_URL is required' }),
  PORT: z.number().optional().default(3000),
});

type TEnv = z.infer<typeof envSchema>;

export const ENV: TEnv = envSchema.parse(process.env);
