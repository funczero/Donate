import express from 'express';
import logger from './config/logger';
import { PORT } from './config/env';
import { handleMercadoPagoWebhook } from './webhook/mercadoPagoHandler';

const app = express();

app.use(express.json());
app.post('/webhook', handleMercadoPagoWebhook);

// Inicialização do servidor
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
