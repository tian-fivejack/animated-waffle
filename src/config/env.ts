import "dotenv/config";

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),

  // Database
  DATABASE_URL:
    process.env.DATABASE_URL || "mysql://user:password@localhost:3306/ilcs",
} as const;

// Type for env object
export type Env = typeof env;

// Validate required environment variables
const requiredEnvVars: (keyof typeof env)[] = [
  "DATABASE_URL",
  // 'JWT_SECRET',
];

for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
  }
}
