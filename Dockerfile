# Conversor Universal - Production Dockerfile
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # Build essentials
    build-essential \
    gcc \
    g++ \
    # Document processing tools
    poppler-utils \
    pandoc \
    # File type detection
    libmagic1 \
    libmagic-dev \
    # Cleanup
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create app user
RUN useradd -m -u 1000 conversor && \
    mkdir -p /app && \
    chown conversor:conversor /app

# Set work directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt ./requirements.txt
COPY requirements-prod.txt ./requirements-prod.txt 2>/dev/null || echo "# No prod requirements" > requirements-prod.txt

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir -r requirements-prod.txt

# Copy application code
COPY backend/ ./backend/
COPY src/ ./src/ 2>/dev/null || mkdir -p src
COPY public/ ./public/ 2>/dev/null || mkdir -p public
COPY docs/ ./docs/ 2>/dev/null || mkdir -p docs

# Copy configuration files
COPY package*.json ./ 2>/dev/null || echo "{}" > package.json
COPY next.config.ts ./next.config.ts 2>/dev/null || touch next.config.ts
COPY tailwind.config.ts ./tailwind.config.ts 2>/dev/null || touch tailwind.config.ts
COPY tsconfig.json ./tsconfig.json 2>/dev/null || touch tsconfig.json

# Create necessary directories
RUN mkdir -p logs temp uploads static && \
    chown -R conversor:conversor /app

# Switch to non-root user
USER conversor

# Create gunicorn configuration
RUN cat > gunicorn.conf.py << 'EOF'
# Gunicorn configuration file
bind = "0.0.0.0:8000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 100
preload_app = True
user = "conversor"
group = "conversor"
tmp_upload_dir = "/app/temp"

# Logging
accesslog = "/app/logs/access.log"
errorlog = "/app/logs/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "conversor-universal"

# Security
limit_request_line = 4096
limit_request_fields = 100
limit_request_field_size = 8190
EOF

# Health check script
RUN cat > healthcheck.py << 'EOF'
#!/usr/bin/env python3
import urllib.request
import sys

try:
    response = urllib.request.urlopen('http://localhost:8000/api/v1/health', timeout=10)
    if response.getcode() == 200:
        sys.exit(0)
    else:
        sys.exit(1)
except Exception:
    sys.exit(1)
EOF

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python3 healthcheck.py

# Start command
CMD ["python", "-m", "gunicorn", "-c", "gunicorn.conf.py", "backend.app:app"]