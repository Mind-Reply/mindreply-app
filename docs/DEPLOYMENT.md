# MindReply Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- GitHub Actions runner (if using CI/CD)
- Vercel CLI (`npm i -g vercel`)
- SSH access to production host (mindreply.com)
- Domain registrar access (DNS configuration)

---

## Phase 1: Local Deployment (Development)

### 1.1 Environment Setup

```bash
# Clone repository
git clone https://github.com/angellllkr-eng/mind-reply-core.git
cd mind-reply-core

# Copy environment template
cp .env.example .env.local

# Edit configuration
nano .env.local
```

**Required environment variables:**
```env
AGENT_WALLET_ADDRESS=0x...
AGENT_SESSION_KEY=0x...
NEXTAUTH_SECRET=your_secret_here
OPENAI_API_KEY=sk-...
POSTGRES_PASSWORD=your_db_password
```

### 1.2 Start Services

```bash
# Build & start all services
docker compose up --pull always

# Verify containers running
docker ps

# Check health
docker compose ps
```

**Expected output:**
```
NAME                    STATUS
mindreply-web           Up (healthy)
a11k-web                Up (healthy)
rwa-bridge              Up (healthy)
postgres                Up (healthy)
redis                   Up (healthy)
```

### 1.3 Verify Services

```bash
# Test mindreply-web
curl http://localhost:3000

# Test a11k-web
curl http://localhost:3001

# Test RWA bridge
curl http://localhost:8000

# Test database
psql -h localhost -U mindreply -d mindreply -c "SELECT 1;"

# Test cache
redis-cli -h localhost ping
```

---

## Phase 2: Production Deployment (mindreply.com)

### 2.1 Infrastructure Setup

**Option A: Self-Hosted (Recommended for full control)**

```bash
# On production host (Ubuntu 22.04)

# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker deploy

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Create deployment directory
sudo mkdir -p /opt/mind-reply-core
sudo chown deploy:deploy /opt/mind-reply-core
```

**Option B: Cloud Deployment (AWS ECS / DigitalOcean App Platform)**

Use managed container services instead of Docker Compose. Refer to cloud-specific documentation.

### 2.2 Domain Configuration (DNS)

Update DNS records at your registrar:

```dns
mindreply.com          A       203.0.113.50     # Your server IP
www.mindreply.com      CNAME   mindreply.com
api.mindreply.com      A       203.0.113.50     # Same server or separate API host
```

**Verify DNS propagation:**
```bash
nslookup mindreply.com
dig mindreply.com
```

### 2.3 HTTPS Setup (SSL/TLS)

```bash
# Install Certbot on production host
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d mindreply.com -d www.mindreply.com -d api.mindreply.com

# Automated renewal (cron job)
sudo systemctl enable certbot.timer
```

### 2.4 Nginx Reverse Proxy Setup

Create `/etc/nginx/sites-available/mindreply.com`:

```nginx
upstream mindreply_backend {
    server localhost:3000;
}

upstream rwa_bridge {
    server localhost:8000;
}

server {
    listen 80;
    server_name mindreply.com www.mindreply.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mindreply.com www.mindreply.com;

    ssl_certificate /etc/letsencrypt/live/mindreply.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mindreply.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Gzip compression
    gzip on;
    gzip_types text/html text/css application/json application/javascript;

    # Root location proxy
    location / {
        proxy_pass http://mindreply_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API routes
    location /api/ {
        proxy_pass http://rwa_bridge;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mindreply.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2.5 Deploy Application

```bash
# SSH into production host
ssh deploy@mindreply.com

# Navigate to deployment directory
cd /opt/mind-reply-core

# Clone or pull latest
git clone https://github.com/angellllkr-eng/mind-reply-core.git . || git pull

# Copy environment file (configure first!)
cp .env.example .env.prod

# Edit with production secrets
nano .env.prod

# Start services
docker compose -f docker-compose.prod.yml up -d

# Verify deployment
docker compose ps
```

### 2.6 Verify Production Deployment

```bash
# Check container health
docker compose ps

# Test endpoints
curl https://mindreply.com
curl https://mindreply.com/api/health
curl https://api.mindreply.com

# View logs
docker compose logs -f mindreply-web
docker compose logs -f rwa-bridge
```

---

## Phase 3: A11-K Production Deployment (a11-k.space via Vercel)

### 3.1 Link to Vercel Project

```bash
# In repository root
vercel link

# When prompted:
# - Which scope? → your-organization
# - Link to existing? → Select your a11k-space project
# - Set production branch? → main
```

### 3.2 Configure Environment Variables (Vercel Dashboard)

Navigate to **Project Settings → Environment Variables**:

```env
NEXTAUTH_URL=https://a11-k.space
NEXTAUTH_SECRET=your_secret_here
NEXT_PUBLIC_API_BASE=https://api.a11-k.space
POSTGRES_URL=postgresql://...  # Shared with mindreply.com
REDIS_URL=redis://...          # Shared with mindreply.com
OPENAI_API_KEY=sk-...
```

### 3.3 Automatic Deployment via GitHub

```bash
# GitHub Actions will auto-deploy when:
# - Push to main branch
# - Files in apps/a11k/** changed

# View deployment logs:
# Dashboard → GitHub repo → GitHub Actions → Deploy A11-K
```

### 3.4 Verify A11-K Deployment

```bash
# Test production deployment
curl https://a11-k.space

# View logs in Vercel dashboard
# Dashboard → Deployments → Select latest → Logs
```

---

## Phase 4: DNS for A11-K (a11-k.space)

Update DNS records:

```dns
a11-k.space            CNAME   cname.vercel-dns.com
www.a11-k.space        CNAME   cname.vercel-dns.com
```

**Verify:**
```bash
nslookup a11-k.space
```

---

## Maintenance & Updates

### Rolling Updates (Zero Downtime)

```bash
# Pull latest changes
git pull origin main

# Build new images (in parallel)
docker compose -f docker-compose.prod.yml build

# Restart services one at a time
docker compose -f docker-compose.prod.yml up -d mindreply-web
# Wait for health check to pass
sleep 10

docker compose -f docker-compose.prod.yml up -d a11k-web
sleep 10

docker compose -f docker-compose.prod.yml up -d rwa-bridge
```

### Backup & Disaster Recovery

```bash
# Automated daily backup (cron job)
0 2 * * * /opt/scripts/backup-postgres.sh
0 3 * * * /opt/scripts/backup-redis.sh

# Manual backup
docker compose exec postgres pg_dump -U mindreply mindreply > backup-$(date +%Y%m%d).sql

# Restore from backup
cat backup-20260805.sql | docker compose exec -T postgres psql -U mindreply -d mindreply
```

---

## Troubleshooting

**Container fails to start:**
```bash
docker compose logs mindreply-web
docker compose logs rwa-bridge
```

**Database connection errors:**
```bash
docker compose exec postgres psql -U mindreply -c "SELECT 1;"
```

**Port conflicts:**
```bash
# Check if port is in use
lsof -i :3000
# Kill conflicting process
kill -9 <PID>
```

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

---

## References

- [Architecture](./ARCHITECTURE.md)
- [Operations](./OPERATIONS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
