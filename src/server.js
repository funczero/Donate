import express from 'express';
import logger from './config/logger.js';
import { PORT } from './config/env.js';
import { handleMercadoPagoWebhook } from './webhook/mercadoPagoHandler.js';
import { connectMongo } from './database/mongo.js';

const app = express();

app.use(express.json());
app.post('/webhook', handleMercadoPagoWebhook);

connectMongo().then(() => {
  app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  logger.fatal(`Erro ao iniciar o servidor: ${err.message}`);
  process.exit(1);
});
