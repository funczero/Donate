import express from 'express';
import logger from './config/logger.js';
import { PORT } from './config/env.js';
import { handleMercadoPagoWebhook } from './webhook/mercadoPagoHandler.js';

const app = express();

app.use(express.json());
app.post('/webhook', handleMercadoPagoWebhook);

// Inicialização do servidor
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
