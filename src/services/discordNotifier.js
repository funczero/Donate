import axios from 'axios';
import logger from '../config/logger';
import { DISCORD_WEBHOOK_URL } from '../config/env';

export async function notifyDiscord(userId, amount) {
  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: `<@${userId}> doou **R$${amount}** para o projeto **Punishment**.`
    });
    logger.info(`Notificação enviada ao Discord para <@${userId}>`);
  } catch (error) {
    logger.error(`Erro ao enviar notificação ao Discord: ${error.message}`);
    throw error;
  }
}
