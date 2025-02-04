require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 80;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('[INFO] Erro ao validar assinatura do Stripe:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userId = session.metadata?.userId || 'Usuário Desconhecido';
        const amount = session.amount_total / 100;

        console.log(`[SUCESSO] Pagamento confirmado: R$${amount} por <@${userId}>`);

        try {
            await axios.post(DISCORD_WEBHOOK_URL, {
                content: `<@${userId}> doou **R$${amount}** para o projeto **Punishment**.`
            });
            console.log('[SUCESSO] Mensagem enviada pelo Webhook do Discord');
        } catch (error) {
            console.error('[INFO] Erro ao enviar mensagem pelo Webhook do Discord:', error.message);
        }
    }

    res.json({ received: true });
});

app.listen(PORT, () => {
    console.log(`[SUCESSO] Servidor rodando na porta ${PORT}`);
});
