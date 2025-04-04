require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const app = express();
const PORT = process.env.PORT;

if (!process.env.STRIPE_SECRET_KEY || !process.env.DISCORD_WEBHOOK_URL || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[ERRO] Variáveis de ambiente obrigatórias não configuradas. Verifique o arquivo .env.');
    process.exit(1);
}

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('[ERRO] Falha ao validar assinatura do Stripe:', err.message);
        return res.status(400).send(`Erro no Webhook: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userId = session.metadata?.userId || 'Usuário Desconhecido';
        const amount = session.amount_total / 100;

        console.log(`[INFO] Pagamento confirmado: R$${amount} por <@${userId}>`);

        try {
            await axios.post(DISCORD_WEBHOOK_URL, {
                content: `<@${userId}> doou **R$${amount}** para o projeto **Punishment**.`
            });
            console.log('[SUCESSO] Notificação enviada para o Discord.');
        } catch (error) {
            console.error('[ERRO] Falha ao enviar notificação para o Discord:', error.message);
        }
    }

    res.json({ received: true });
});

app.listen(PORT, () => {
    console.log(`[SUCESSO] Servidor rodando na porta ${PORT}`);
});