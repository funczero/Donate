import dotenv from 'dotenv';
dotenv.config();

export const {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  DISCORD_WEBHOOK_URL,
  PORT = 3000,
} = process.env;

const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'DISCORD_WEBHOOK_URL'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[ENV] Variável de ambiente faltando: ${key}`);
    process.exit(1);
  }
}
