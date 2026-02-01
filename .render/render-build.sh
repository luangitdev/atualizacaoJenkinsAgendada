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

# Instalar dependências Python (forçando uso do pip)
echo "Instalando dependências Python..."
chmod +x .render/install-python-deps.sh
.render/install-python-deps.sh

echo "=== Build do Render concluído ==="