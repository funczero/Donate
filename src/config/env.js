import dotenv from 'dotenv';
dotenv.config();

// Variáveis de ambiente necessárias
export const {
  MERCADO_PAGO_ACCESS_TOKEN,
  DISCORD_WEBHOOK_URL,
  PORT,
} = process.env;

// Variáveis obrigatórias
const required = [
  'MERCADO_PAGO_ACCESS_TOKEN',
  'DISCORD_WEBHOOK_URL',
  'PORT',
];

// Verificação de variáveis
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[ENV] Variável de ambiente faltando: ${key}`);
    process.exit(1);
  }
}
