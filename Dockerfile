# Stage 1: Compilar frontend React/Vite
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime Python FastAPI
FROM python:3.11-slim AS runtime
WORKDIR /app

# Instalar dependencias del sistema mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instalar requerimientos Python
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copiar código del backend
COPY backend/ ./backend/

# Copiar frontend compilado desde el stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 8000
ENV PORT=8000

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
