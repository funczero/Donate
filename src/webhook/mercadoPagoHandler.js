'use strict';

const mercadopago = require('mercadopago');
const logger = require('../config/logger.js');
const { notifyDiscord } = require('../services/discordNotifier.js');

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

module.exports.handleMercadoPagoWebhook = async (req, res) => {
  const event = req.body;

  if (!event || !event.type) {
    logger.warn('Webhook do Mercado Pago malformado.');
    return res.status(400).send('Evento inválido');
  }

  const paymentId = event.data?.id;

  if (!paymentId) {
    logger.warn('Evento do Mercado Pago sem ID de pagamento.');
    return res.sendStatus(400);
  }

  try {
    const payment = await mercadopago.payment.findById(paymentId);

    const status = payment.body.status;
    const metadata = payment.body.metadata || {};
    const userId = metadata.discord_user || '0';
    const amount = Number(payment.body.transaction_amount).toFixed(2);

    if (status === 'approved') {
      logger.info(`Pagamento aprovado via MP: R$${amount} de <@${userId}>`);
      try {
        await notifyDiscord(userId, amount);
      } catch (err) {
        logger.warn(`Erro ao notificar Discord: ${err.message}`);
      }
    } else {
      logger.info(`Pagamento com status: ${status} (ignorado)`);
    }

    return res.sendStatus(200);
  } catch (error) {
    logger.error(`Erro ao buscar pagamento do Mercado Pago: ${error.message}`);
    return res.status(500).send('Erro ao processar pagamento');
  }
};
