import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '../config/env.js';
import logger from '../config/logger.js';
import { notifyDiscord } from '../services/discordNotifier.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error(`Assinatura Stripe inválida: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId || '0';
    const amount = (session.amount_total / 100).toFixed(2);

    logger.info(`Pagamento de R$${amount} recebido de <@${userId}>`);
    try {
      await notifyDiscord(userId, amount);
    } catch {
      logger.warn('Erro ao notificar o Discord, mas pagamento foi processado.');
    }
  } else {
    logger.warn(`Evento ignorado: ${event.type}`);
  }

  res.sendStatus(200);
}
