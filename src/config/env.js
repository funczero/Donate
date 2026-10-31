import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "MERCADO_PAGO_ACCESS_TOKEN",
  "DISCORD_WEBHOOK_URL",
  "MONGO_URI",
  "PORT",
];

const missingVariables = requiredVariables.filter(
  (key) => !process.env[key],
);

if (missingVariables.length > 0) {
  console.error(
    `[ENV] Missing required environment variables: ${missingVariables.join(", ")}`,
  );

  process.exit(1);
}

export const {
  MERCADO_PAGO_ACCESS_TOKEN,
  DISCORD_WEBHOOK_URL,
  MONGO_URI,
  PORT,
} = process.env;
