import winston from 'winston';
import moment from 'moment-timezone';

/**
 * Gera timestamp no fuso horário de São Paulo.
 * Exemplo: 2025-08-03 15:42:10
 */
const timestampSP = () =>
  moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
});

/**
 * Formato customizado dos logs.
 * Inclui timestamp, nível e mensagem.
 */
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
});

/**
 * Logger principal da aplicação.
 * - Usa timestamp de São Paulo
 * - Aplica cores no console
 * - Separa arquivos por tipo de log
 */
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: timestampSP }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampSP }),
        winston.format.uncolorize(),
        logFormat
      )
    }),

    new winston.transports.File({
      filename: 'logs/warn.log',
      level: 'warn',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampSP }),
        winston.format.uncolorize(),
        logFormat
      )
    }),

    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampSP }),
        winston.format.uncolorize(),
        logFormat
      )
    }),
  ],
});

export default logger;
