import axios from 'axios';
import logger from '../config/logger.js';
import { DISCORD_WEBHOOK_URL } from '../config/env.js';

export async function notifyDiscord(userId, amount) {
  const message = {
    content: `<@${userId}> doou **R$${amount}** para o projeto **Punishment**.`,
  };

  try {
    await axios.post(DISCORD_WEBHOOK_URL, message);
    logger.info(`Notificação enviada ao Discord para o usuário ${userId} (R$${amount})`);
  } catch (err) {
    logger.error(`Erro ao enviar notificação ao Discord: ${err.message}`);
    throw err;
  }
}
