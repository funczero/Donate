require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// WebSocket Server para comunicação com o bot
const wss = new WebSocket.Server({ port: 8080 });

// Middleware para processar JSON
app.use(bodyParser.json());

// Lista de conexões ativas do bot
let botConnection = null;

// Conexão WebSocket com o bot
wss.on('connection', (ws) => {
    console.log('🤖 Bot conectado ao WebSocket');
    botConnection = ws;

    ws.on('close', () => {
        console.log('⚠️ Bot desconectado do WebSocket');
        botConnection = null;
    });
});

// Rota Webhook do Stripe
app.post('/webhook', async (req, res) => {
    try {
        const event = req.body;

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;
            const amount = session.amount_total / 100;

            console.log(`✅ Pagamento confirmado: R$${amount} por <@${userId}>`);

            // Envia para o WebSocket (bot recebe e envia a mensagem)
            if (botConnection) {
                botConnection.send(JSON.stringify({ userId, amount }));
            } else {
                console.log('⚠️ Nenhuma conexão ativa do bot.');
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('❌ Erro no Webhook:', error);
        res.status(400).send('Erro no Webhook');
    }
});

// Inicia o servidor
app.listen(PORT, () => console.log(`🚀 Webhook rodando na porta ${PORT}`));
