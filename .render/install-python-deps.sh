#!/bin/bash

# Script para forçar instalação de dependências Python com pip
# Isso é necessário porque o Render detecta automaticamente Poetry

echo "Instalando dependências Python com pip..."

# Instalar dependências do requirements.txt
pip install --no-cache-dir -r requirements.txt

# Verificar se o gunicorn foi instalado
if python -c "import gunicorn" 2>/dev/null; then
    echo "✅ gunicorn instalado com sucesso"
else
    echo "❌ gunicorn não foi instalado"
    echo "Tentando instalação direta do gunicorn..."
    pip install --no-cache-dir gunicorn==21.2.0
fi

echo "Dependências Python instaladas:"
pip list | grep -E "(gunicorn|flask|sqlalchemy)"