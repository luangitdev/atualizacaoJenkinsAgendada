# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY vite.config.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY index.html ./
COPY src/ ./src/

# Build frontend
RUN npm run build

# Production stage for backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY app.py ./
COPY models.py ./

# Copy built frontend from build stage
COPY --from=frontend-build /app/dist ./public

# Create non-root user
RUN useradd -m -u 1000 appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 5000

# Start application
CMD ["python", "app.py"]