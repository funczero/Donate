import mongoose from "mongoose";
import path from "path";
import logger from "../config/logger.js";
import { performance } from "perf_hooks";

mongoose.set("strictQuery", true);
mongoose.set("autoIndex", false);

const mongoOptions = {
  autoIndex: false,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,

  tls: true,
  tlsCertificateKeyFile: path.resolve(
    process.cwd(),
    "certs",
    "mongodb.pem"
  ),

  tlsAllowInvalidCertificates: true,
};

mongoose.connection.on("disconnected", () => {
  logger.warn("Conexão com MongoDB encerrada.");
});

mongoose.connection.on("reconnected", () => {
  logger.info("Reconectado ao MongoDB.");
});

mongoose.connection.on("error", (err) => {
  logger.error("Erro na conexão com MongoDB", {
    error: err.message,
  });
});

/**
 * Conecta o servidor ao MongoDB.
 */
export async function connectMongo() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "A variável de ambiente MONGO_URI não foi definida."
    );
  }

  if (mongoose.connection.readyState === 1) {
    logger.info(
      "MongoDB já está conectado. Retornando conexão existente."
    );

    return mongoose.connection;
  }

  const start = performance.now();

  try {
    await mongoose.connect(uri, mongoOptions);

    logger.info("MongoDB conectado com sucesso", {
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      timeMs: `${(performance.now() - start).toFixed(2)}ms`,
    });

    return mongoose.connection;
  } catch (error) {
    logger.error("Falha ao conectar ao MongoDB", {
      error: error.message,
    });

    throw error;
  }
}
