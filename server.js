require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios'); 
const app = express();
const PORT = process.env.PORT || 3000;


const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1324197709820723250/dEaRP-FV62DmsPwVfBGuaE4bUa-8IuqvyhrryA1TMRLvA4tdNVmpMobohpV18ruuwqnF';


app.use(bodyParser.json());


app.post('/webhook', async (req, res) => {
    try {
        const event = req.body;

        
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId; 
            const amount = session.amount_total / 100; 

            console.log(`✅ Pagamento confirmado: R$${amount} por <@${userId}>`);

            try {
                await axios.post(DISCORD_WEBHOOK_URL, {
                    content: `🎉 Obrigado pela doação de **R$${amount}**, <@${userId}>! Seu apoio é muito importante! 🙌`
                });
                console.log('✅ Mensagem enviada pelo Webhook do Discord');
            } catch (error) {
                console.error('❌ Erro ao enviar mensagem pelo Webhook do Discord:', error);
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('❌ Erro no Webhook do Stripe:', error);
        res.status(400).send('Erro no Webhook');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Webhook rodando na porta ${PORT}`);
});
