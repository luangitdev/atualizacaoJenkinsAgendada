#!/bin/bash

# Build script específico para Render

echo "=== Build do Render iniciado ==="

# Instala dependências do frontend
echo "Installing frontend dependencies..."
npm install

# Build do frontend
echo "Building frontend React..."
npm run build

# Verificar se o build foi bem sucedido
if [ $? -eq 0 ]; then
    echo "✅ Frontend build realizado com sucesso"
else
    echo "❌ Erro no build do frontend"
    exit 1
fi

echo "=== Build do Render concluído ==="