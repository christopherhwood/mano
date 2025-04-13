import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define environment variable schema
const envSchema = z.object({
  PORT: z.string().default('3000'),
  GROQ_API_KEY: z.string().min(1),
  GOOGLE_PLACES_API_KEY: z.string().min(1),
  BROWSERBASE_API_KEY: z.string().min(1),
  BROWSERBASE_PROJECT_ID: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

// Parse and validate environment variables
export type EnvVars = z.infer<typeof envSchema>;

let env: EnvVars;
try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('Missing required environment variables:', error);
  process.exit(1);
}

export default env;