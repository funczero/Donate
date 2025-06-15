import express from 'express';
import { handleStripeWebhook } from './webhook/stripeHandler.js';
import logger from './config/logger.js';
import { PORT } from './config/env.js';

const app = express();

app.use('/webhook', express.raw({ type: 'application/json' }));
app.post('/webhook', handleStripeWebhook);

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
