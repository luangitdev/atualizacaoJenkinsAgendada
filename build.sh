#!/bin/bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Installing Node dependencies ==="
npm install

echo "=== Building frontend ==="
npm run build

echo "=== Build completed successfully ==="
ls -la dist/
