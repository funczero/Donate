import dotenv from 'dotenv';
dotenv.config();

// Variáveis de ambiente exportadas
export const {
  MERCADO_PAGO_ACCESS_TOKEN,
  DISCORD_WEBHOOK_URL,
  PORT
} = process.env;

// Verificação de variáveis obrigatórias
const required = ['MERCADO_PAGO_ACCESS_TOKEN', 'DISCORD_WEBHOOK_URL', 'PORT'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`[ENV] Variável de ambiente obrigatória ausente: ${key}`);
    process.exit(1);
  }
}
