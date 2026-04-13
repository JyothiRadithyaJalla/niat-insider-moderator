import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment file based on NODE_ENV
const envSuffix = process.env.NODE_ENV || 'development';
const envFile = `.env.${envSuffix}`;
dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

interface EnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NODE_ENV: string;
  CLIENT_URL: string;
}

const getEnvVariable = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVariable('PORT', '5000'), 10),
  MONGO_URI: getEnvVariable('MONGO_URI'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVariable('JWT_EXPIRES_IN', '1d'),
  NODE_ENV: getEnvVariable('NODE_ENV', 'development'),
  CLIENT_URL: getEnvVariable('CLIENT_URL', 'http://localhost:5173'),
};
