import mercadopago from 'mercadopago';
import logger from '../config/logger.js';
import { notifyDiscord } from '../services/discordNotifier.js';

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const processedPayments = new Set();

/**
 * Webhook do Mercado Pago para processar notificações de pagamento.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */

export async function handleMercadoPagoWebhook(req, res) {
  const event = req.body;

  if (!event?.type || !event?.data?.id) {
    logger.warn('[MP Webhook] Evento inválido ou malformado recebido.');
    return res.status(400).send('Evento inválido');
  }

  const paymentId = event.data.id;
  
  if (processedPayments.has(paymentId)) {
    logger.info(`[MP Webhook] Pagamento ${paymentId} já foi processado. Ignorando duplicata.`);
    return res.status(200).send('Duplicado');
  }

  try {
    const response = await mercadopago.payment.findById(paymentId);
    const payment = response.body;

    const {
      status,
      transaction_amount,
      metadata = {},
    } = payment;

    const userId = metadata.discord_user || '0';
    const amount = Number(transaction_amount).toFixed(2);

    if (status === 'approved') {
      logger.info(`[MP Webhook] Pagamento aprovado: R$${amount} de <@${userId}>`);

      processedPayments.add(paymentId);

      try {
        await notifyDiscord(userId, amount);
      } catch (notifyError) {
        logger.warn(`[MP Webhook] Pagamento recebido, mas falha ao notificar Discord: ${notifyError.message}`);
      }
    } else {
      logger.info(`[MP Webhook] Pagamento com status '${status}' ignorado (ID: ${paymentId})`);
    }

    return res.sendStatus(200);

  } catch (error) {
    logger.error(`[MP Webhook] Falha ao consultar pagamento ${paymentId}: ${error.message}`);
    return res.status(500).send('Não foi possível processar o pagamento');
  }
}
