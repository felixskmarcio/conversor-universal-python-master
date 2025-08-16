# 🚀 Deployment Guide

## Production Deployment

### Prerequisites
- Python 3.9+
- 2GB+ RAM
- SSL certificate
- Domain name
- Reverse proxy (Nginx/Apache)

### Environment Setup

1. **Create production environment:**
```bash
python -m venv venv-prod
source venv-prod/bin/activate
pip install -r requirements.txt
```

2. **Set environment variables:**
```bash
export FLASK_ENV=production
export SECRET_KEY="your-secure-secret-key"
export MAX_CONTENT_LENGTH=16777216
export RATE_LIMIT=100/hour
```

3. **Configure application:**
```python
# config.py
class ProductionConfig:
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    RATELIMIT_STORAGE_URL = 'redis://localhost:6379'
```

### Gunicorn Configuration

**gunicorn.conf.py:**
```python
bind = "127.0.0.1:8000"
workers = 4
worker_class = "sync"
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 100
preload_app = True
```

### Nginx Configuration

**nginx.conf:**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private.key;
    
    client_max_body_size 16M;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /static {
        alias /path/to/static/files;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Systemd Service

**conversor.service:**
```ini
[Unit]
Description=Conversor Universal
After=network.target

[Service]
User=conversor
Group=conversor
WorkingDirectory=/opt/conversor
Environment=PATH=/opt/conversor/venv-prod/bin
ExecStart=/opt/conversor/venv-prod/bin/gunicorn -c gunicorn.conf.py app:app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Docker Production

**Dockerfile.prod:**
```dockerfile
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 conversor && chown -R conversor:conversor /app
USER conversor

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Start application
CMD ["gunicorn", "-c", "gunicorn.conf.py", "app:app"]
```

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=${SECRET_KEY}
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis
    networks:
      - conversor-net

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - conversor-net

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    networks:
      - conversor-net

volumes:
  redis-data:

networks:
  conversor-net:
    driver: bridge
```

### AWS Deployment

**Using EC2:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

**Using ECS:**
```json
{
  "family": "conversor-universal",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "conversor-app",
      "image": "your-account.dkr.ecr.region.amazonaws.com/conversor:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "FLASK_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

### Monitoring Setup

**Health checks:**
```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:8000/api/v1/health || echo "Service down"
```

**Log monitoring:**
```bash
# Logrotate configuration
/var/log/conversor/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    postrotate
        systemctl reload conversor
    endscript
}
```

### SSL/TLS Setup

**Using Let's Encrypt:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
0 12 * * * /usr/bin/certbot renew --quiet
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/conversor"

# Backup application files
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" /opt/conversor

# Backup configuration
cp /etc/nginx/nginx.conf "$BACKUP_DIR/nginx_$DATE.conf"
cp /etc/systemd/system/conversor.service "$BACKUP_DIR/service_$DATE.conf"

# Cleanup old backups (keep 7 days)
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
```

### Performance Tuning

**System limits:**
```bash
# /etc/security/limits.conf
conversor soft nofile 65536
conversor hard nofile 65536
```

**Kernel parameters:**
```bash
# /etc/sysctl.conf
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
```