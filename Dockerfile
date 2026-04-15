# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# Use package-lock.json if it exists, otherwise package.json
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Run build - expects output in /app/frontend/dist
RUN npm run build

# Stage 2: Production with Python and Nginx
FROM python:3.13-slim
WORKDIR /app

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy and prepare start script
COPY start.sh ./
RUN tr -d '\r' < start.sh > start_unix.sh && mv start_unix.sh start.sh && chmod +x start.sh

# The application will listen on port 80 (Nginx) which proxies to 8000 (FastAPI)
EXPOSE 80

# Use start.sh as the entrypoint
CMD ["./start.sh"]
