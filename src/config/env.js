import dotenv from 'dotenv';
dotenv.config();

const requiredVars = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'DISCORD_WEBHOOK_URL'];

for (const key of requiredVars) {
  if (!process.env[key]) {
    console.error(`[ENV] Variável de ambiente ausente: ${key}`);
    process.exit(1);
  }
}

export const {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  DISCORD_WEBHOOK_URL,
  PORT = 3000,
} = process.env;
