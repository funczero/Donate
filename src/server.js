import express from 'express';
import { PORT } from './config/env.js';
import logger from './config/logger.js';
import { handleStripeWebhook } from './webhook/stripeHandler.js';

const app = express();

app.use('/webhook', express.raw({ type: 'application/json' }));

app.post('/webhook', handleStripeWebhook);

app.listen(PORT, () => {
  logger.info(`Servidor iniciado na porta ${PORT}`);
});
