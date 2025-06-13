require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const { DISCORD_WEBHOOK_URL } = process.env;

if (!DISCORD_WEBHOOK_URL) {
  console.error('[error] Variável DISCORD_WEBHOOK_URL não configurada.');
  process.exit(1);
}

// Mercado Pago envia em JSON comum
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const event = req.body;

  // Exemplo: quando um pagamento for criado ou atualizado
  const { type, data } = event;

  if (type !== 'payment') {
    console.warn(`[warn] Evento ignorado: ${type}`);
    return res.sendStatus(200);
  }

  const paymentId = data.id;

  try {
    // Buscar detalhes do pagamento no Mercado Pago
    const { data: payment } = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_TOKEN}`
        }
      }
    );

    const valor = payment.transaction_amount.toFixed(2);
    const userId = payment.metadata?.discord_id || '0';
    const status = payment.status;

    if (status === 'approved') {
      console.log(`[info] Pagamento aprovado: R$${valor} - <@${userId}>`);

      await axios.post(DISCORD_WEBHOOK_URL, {
        content: `<@${userId}> doou **R$${valor}** para o projeto **Punishment**. Muito obrigado! ❤️`
      });

      console.log('[info] Notificação enviada ao Discord.');
    } else {
      console.log(`[info] Pagamento ${status}: ${paymentId}`);
    }
  } catch (err) {
    console.error(`[error] Falha ao processar pagamento: ${err.message}`);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`[info] Servidor iniciado na porta ${PORT}`);
});
