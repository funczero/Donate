import mongoose from 'mongoose';
import logger from '../config/logger.js';
import { performance } from 'perf_hooks';

/**
 * Conecta o servidor ao banco de dados MongoDB.
 */

export async function connectMongo() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error('A variável de ambiente MONGO_URI não foi definida.');
    process.exit(1);
  }

  const start = performance.now();

  try {
    await mongoose.connect(uri, {
      autoIndex: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    const time = (performance.now() - start).toFixed(2);
    logger.info(`MongoDB conectado [${mongoose.connection.name}] em ${time}ms.`);

    mongoose.connection
      .on('disconnected', () => logger.warn('Conexão com o MongoDB encerrada.'))
      .on('reconnected', () => logger.info('Reconectado ao MongoDB.'))
      .on('error', err => logger.error(`Erro de conexão com o MongoDB: ${err.message}`));

  } catch (error) {
    logger.fatal(`Erro fatal ao conectar-se ao MongoDB: ${error.stack || error.message}`);
    process.exit(1);
  }
}
