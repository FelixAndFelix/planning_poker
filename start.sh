#!/bin/sh

# Start FastAPI backend in the background
# We assume the virtualenv or system python has the dependencies installed
# and the code is in /app/backend
echo "Starting backend..."
cd /app/backend
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g 'daemon off;'
