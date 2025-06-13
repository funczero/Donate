require('dotenv').config();

const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

const PORT = process.env.PORT || 3000;
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, DISCORD_WEBHOOK_URL } = process.env;

if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !DISCORD_WEBHOOK_URL) {
  console.error('[error] Variáveis de ambiente não configuradas.');
  process.exit(1);
}

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`[error] Assinatura Stripe inválida: ${err.message}`);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const { metadata, amount_total } = event.data.object;
    const userId = metadata?.userId || '0';
    const amount = (amount_total / 100).toFixed(2);

    console.log(`[info] Pagamento recebido: R$${amount} - <@${userId}>`);

    try {
      await axios.post(DISCORD_WEBHOOK_URL, {
        content: `<@${userId}> doou **R$${amount}** para o projeto **Punishment**.`
      });
      console.log('[info] Notificação enviada ao Discord.');
    } catch (err) {
      console.error(`[error] Falha ao enviar notificação ao Discord: ${err.message}`);
    }
  } else {
    console.warn(`[warn] Evento ignorado: ${event.type}`);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`[info] Servidor iniciado na porta ${PORT}`);
});
