#!/bin/bash

echo ""
echo "📦 Punishment Webhook – Atualizando dependências do projeto..."
echo ""

# Instalar/atualizar as dependências principais
npm install \
  axios@^1.7.9 \
  dotenv@^16.4.7 \
  express@^4.21.2 \
  stripe@^17.6.0 \
  winston@^3.10.0

# Dependências de desenvolvimento
npm install -D nodemon@^3.1.0

echo ""
echo "✅ Todas as dependências foram instaladas ou atualizadas com sucesso!"
echo "🚀 Você pode iniciar com: npm run dev"
echo ""
