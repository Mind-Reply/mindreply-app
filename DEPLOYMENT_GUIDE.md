# MindReply Build & Deployment Guide

## Local Development

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- Node.js 18+
- Python 3.11+

### Quick Start

```bash
cd Users/ANGEL

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your configuration

# Start all services
docker compose up --pull always

# Access the app
# - Frontend: http://localhost:3000
# - RWA Bridge: http://localhost:8000
```

## Building the Frontend

### Local Build (Next.js)

```bash
cd apps/replycontrol-web

npm install
npm run build
npm run start
```

### Docker Build

```bash
cd apps/replycontrol-web
docker build -t mind-reply:latest .
docker run -p 3000:3000 mind-reply:latest
```

## Docker Image Details

**Frontend Image**: `mind-reply:latest`
- Base: node:18-alpine (multi-stage build)
- Size: ~200MB
- Includes: Next.js 14, React 18, Tailwind CSS
- Health check: HTTP probe on port 3000
- Entrypoint: `npm start` (production server)

**RWA Bridge Image**: `rwa-bridge:latest`
- Base: python:3.11-slim (multi-stage builder)
- Size: ~120MB
- Includes: httpx, asyncio, RWA acquisition engine
- Health check: Python import probe
- Entrypoint: `python apex_titan_rwa_bridge.py`
- Security: Non-root user (appuser:1000)

## Production Deployment

### Docker Compose Production

```bash
# Deploy with production config
docker compose -f docker-compose.prod.yml up -d

# Verify services
docker compose ps
curl http://localhost:3000
curl http://localhost:8000
```

### Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace mind-reply

# Apply manifests (create k8s/*.yaml files)
kubectl apply -f k8s/ -n mind-reply

# Check status
kubectl get pods -n mind-reply
kubectl logs -f deployment/web-replycontrol -n mind-reply
```

### Vercel Deployment (Frontend Only)

1. **Connect GitHub Repository**
   ```bash
   vercel link
   ```

2. **Configure Environment**
   - Set `NEXT_PUBLIC_RWA_BRIDGE_URL` in Vercel dashboard
   - Connect to GitHub for auto-deployments

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

## CI/CD Workflows

### GitHub Actions Setup

1. Create `.github/workflows/deploy-vercel.yml` for Vercel deployments
2. Create `.github/workflows/build-docker.yml` for Docker image builds
3. Set secrets in GitHub:
   - `VERCEL_TOKEN` - Vercel API token
   - `DOCKER_USERNAME` - Docker Hub/registry username
   - `DOCKER_PASSWORD` - Docker Hub/registry password

### Automated Deployments

**On push to main:**
- Build Next.js app
- Run type checks & linting
- Build Docker images
- Push to container registry
- Deploy to Vercel (frontend)

**On push to develop:**
- Build Docker images
- Tag as `develop` and `sha`
- Push to registry (staging)

## Environment Variables

### Frontend (.env.local)

```env
# Next.js doesn't require explicit env setup for dev
# All variables prefixed with NEXT_PUBLIC_ are available in browser
NEXT_PUBLIC_RWA_BRIDGE_URL=http://localhost:8000
```

### RWA Bridge (.env.local)

```env
LEGAL_ENTITY_API_URL=https://api.otoco.io/v1
AGENT_WALLET_ADDRESS=0x321...AI_AGENT
AGENT_SESSION_KEY=0x_scoped_session_token
```

### Docker Compose (.env)

```env
NODE_ENV=production
AGENT_WALLET_ADDRESS=0x321...AI_AGENT
AGENT_SESSION_KEY=0x_scoped_session_token
```

## Troubleshooting

### Port Already in Use
```bash
# Find and stop conflicting service
docker ps | grep 3000
docker stop <container_id>

# Or use different port
docker run -p 3001:3000 mind-reply:latest
```

### Build Failures

**Next.js build errors:**
```bash
docker compose logs web-replycontrol
npm run lint
npm run build
```

**RWA Bridge errors:**
```bash
docker compose logs rwa-bridge
python apex_titan_rwa_bridge.py  # Test locally
```

### Health Check Failures

```bash
# Check if service is responding
curl -v http://localhost:3000/
curl -v http://localhost:8000

# View health check history
docker inspect mind-reply-web | grep -A 5 Health
```

## Performance Optimization

### Image Size Reduction
- Multi-stage builds already applied
- Alpine base images used
- Only production dependencies included

### Build Time Optimization
- Layer caching configured
- Minimal context transfer
- Production build optimizations enabled

### Runtime Optimization
- Next.js static export where possible
- Lazy loading configured
- CSS/JS minification enabled

## Security Checklist

- [x] Non-root user in RWA Bridge container
- [x] Secrets not baked into images (use .env files)
- [x] Health checks configured
- [x] Network isolation via Docker bridge
- [x] Volume permissions restricted
- [ ] HTTPS in production (use reverse proxy/load balancer)
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all forms
- [ ] CSRF protection on forms
- [ ] API authentication (add token/session management)

## Monitoring & Logging

```bash
# Real-time logs
docker compose logs -f

# Specific service logs
docker compose logs -f web-replycontrol

# Historical logs
docker compose logs --tail=100

# Stats and resource usage
docker stats

# Check for errors
docker compose logs | grep ERROR
```

## Backup & Recovery

```bash
# Backup volumes
docker volume ls
docker run --rm -v rwa-logs:/data -v $(pwd):/backup \
  alpine tar czf /backup/rwa-logs.tar.gz -C /data .

# Restore volumes
docker run --rm -v rwa-logs:/data -v $(pwd):/backup \
  alpine tar xzf /backup/rwa-logs.tar.gz -C /data
```
