# MindReply Live Deployment Manual

**Status:** Ready for Production
**Version:** 1.0 (2026-09-15)
**Environments:** Local | Staging | Production

---

## 🎯 Quick Start (5 minutes)

### Option 1: Local Deployment
```bash
cd C:\Users\Mindr\MindReply-personal-current

# Copy environment template
cp .env.production.example .env.local

# Edit with your Stripe keys
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_test_...

# Start services
docker compose up --pull always

# Test
curl http://localhost:3000/api/health
curl http://localhost:8000/health
```

### Option 2: Using Deployment Script
```powershell
# Windows
.\build-deploy.ps1

# Linux/Mac
bash build-deploy.sh
```

### Option 3: Multi-Agent Orchestration
```bash
node deploy-orchestrator.js
```

---

## 📦 Deployment Options

### 1. Local Development
**Use when:** Testing locally before pushing to production

```bash
docker compose up -d

# Access
# - Frontend: http://localhost:3000
# - API: http://localhost:3000/api
# - RWA Bridge: http://localhost:8000
# - Health: http://localhost:3000/api/health

# Stop
docker compose down
```

---

### 2. Self-Hosted (Docker Swarm)
**Use when:** Running on single/multiple machines you control

#### 2a. Single Machine
```bash
# Copy production compose file
cp docker-compose.yml docker-compose.prod.yml

# Start stack
docker swarm init  # Only first time
docker stack deploy -c docker-compose.prod.yml mindreply

# Monitor
docker stack ps mindreply
docker stack services mindreply

# Logs
docker service logs mindreply_web-replycontrol
docker service logs mindreply_rwa-bridge

# Stop
docker stack rm mindreply
```

#### 2b. Multi-Machine Cluster
```bash
# On manager node
docker swarm init
docker swarm join-token worker  # Get token for workers

# On worker nodes
docker swarm join --token SWMTKN-... manager-ip:2377

# Deploy on manager
docker stack deploy -c docker-compose.prod.yml mindreply -c docker-compose.override.yml
```

---

### 3. Kubernetes Deployment
**Use when:** Running in Kubernetes cluster

#### 3a. Create Kubernetes manifests
```bash
mkdir -p k8s
cat > k8s/namespace.yaml <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: mindreply
EOF

cat > k8s/deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rwa-bridge
  namespace: mindreply
spec:
  replicas: 2
  selector:
    matchLabels:
      app: rwa-bridge
  template:
    metadata:
      labels:
        app: rwa-bridge
    spec:
      containers:
      - name: rwa-bridge
        image: rwa-bridge:latest
        ports:
        - containerPort: 8000
        env:
        - name: STRIPE_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: stripe-secrets
              key: secret-key
        - name: STRIPE_WEBHOOK_SECRET
          valueFrom:
            secretKeyRef:
              name: stripe-secrets
              key: webhook-secret
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: rwa-bridge
  namespace: mindreply
spec:
  selector:
    app: rwa-bridge
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: LoadBalancer
EOF

cat > k8s/web-deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-replycontrol
  namespace: mindreply
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-replycontrol
  template:
    metadata:
      labels:
        app: web-replycontrol
    spec:
      containers:
      - name: web
        image: web-replycontrol:latest
        ports:
        - containerPort: 3000
        env:
        - name: STRIPE_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: stripe-secrets
              key: secret-key
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 20
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: web-replycontrol
  namespace: mindreply
spec:
  selector:
    app: web-replycontrol
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
EOF
```

#### 3b. Deploy
```bash
# Create namespace
kubectl create namespace mindreply

# Create secrets
kubectl create secret generic stripe-secrets \
  --from-literal=secret-key=$STRIPE_SECRET_KEY \
  --from-literal=webhook-secret=$STRIPE_WEBHOOK_SECRET \
  -n mindreply

# Apply manifests
kubectl apply -f k8s/ -n mindreply

# Verify
kubectl get pods -n mindreply
kubectl get svc -n mindreply

# Port forward for testing
kubectl port-forward -n mindreply svc/web-replycontrol 3000:80
```

---

### 4. Cloud Platforms

#### 4a. DigitalOcean App Platform
1. Create app.yaml
2. Connect GitHub repo
3. Set environment variables
4. Deploy

#### 4b. AWS (ECS)
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name mindreply

# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task.json

# Run service
aws ecs create-service --cluster mindreply --service-name mindreply-service --task-definition mindreply-task:1 --desired-count 2
```

#### 4c. Azure Container Instances
```bash
az container create \
  --resource-group mindreply \
  --name mindreply-web \
  --image web-replycontrol:latest \
  --ports 3000 \
  --environment-variables STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
```

#### 4d. Heroku
```bash
heroku login
heroku create mindreply
git push heroku main
heroku config:set STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
```

---

## 🔑 Environment Variables

### Required
| Variable | Example | Purpose |
|----------|---------|---------|
| `STRIPE_SECRET_KEY` | sk_live_... | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | whsec_... | Webhook signing secret |
| `STRIPE_PUBLISHABLE_KEY` | pk_live_... | Frontend Stripe key |

### Optional
| Variable | Default | Purpose |
|----------|---------|---------|
| `NODE_ENV` | production | Environment |
| `SUPABASE_URL` | (set) | Database URL |
| `SUPABASE_SECRET_KEY` | (secret) | Auth secret |
| `AGENT_WALLET_ADDRESS` | 0x321... | Default wallet |

---

## 🧪 Health Checks & Testing

### Endpoint Tests
```bash
# Frontend health
curl http://localhost:3000/api/health

# RWA Bridge health
curl http://localhost:8000/health

# Payment challenge (test)
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "test-agent-001",
    "service_type": "rwa_bridge",
    "amount_cents": 50,
    "currency": "usd",
    "payment_method": "spt"
  }'

# Check payment status
curl http://localhost:3000/api/payments/{payment_id}
```

### Container Health
```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f web-replycontrol
docker compose logs -f rwa-bridge

# Resource usage
docker stats
```

---

## 🔒 Production Security

### Pre-Deployment Checklist
- [ ] All secrets in `.env` (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled (via reverse proxy/load balancer)
- [ ] Health checks configured
- [ ] Rate limiting enabled
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Firewall configured
- [ ] SSH keys rotated
- [ ] Stripe webhook endpoint updated

### Network Security
```bash
# Firewall rules (example for DigitalOcean)
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw enable
```

### Reverse Proxy Setup (Nginx)
```nginx
upstream backend {
    server localhost:3000;
}

upstream rwa_bridge {
    server localhost:8000;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/payments {
        proxy_pass http://backend;
        proxy_request_buffering off;
    }
    
    location /rwa {
        proxy_pass http://rwa_bridge;
    }
}
```

---

## 📊 Monitoring & Logging

### Application Monitoring
```bash
# Container metrics
docker stats mindreply-web mindreply-rwa-bridge

# Check recent logs
docker compose logs --tail=100

# Follow logs in real-time
docker compose logs -f
```

### Stripe Dashboard Monitoring
- Monitor payments: https://dashboard.stripe.com/payments
- Check webhooks: https://dashboard.stripe.com/webhooks
- Review logs: https://dashboard.stripe.com/logs

### Set Up Alerts
- Monitor 4xx/5xx errors
- Alert on failed payments
- Track response times
- Monitor CPU/memory usage

---

## 🚀 Go Live Checklist

### Week 1: Testing
- [ ] Local docker-compose stack working
- [ ] All endpoints responding
- [ ] Payment flow tested (test mode)
- [ ] Webhooks receiving events
- [ ] Database migrations complete
- [ ] Logs being captured

### Week 2: Staging
- [ ] Deploy to staging environment
- [ ] Run load tests (100+ concurrent users)
- [ ] Test payment settlements
- [ ] Verify monitoring/alerting
- [ ] Security audit passed
- [ ] Backups automated

### Week 3: Production
- [ ] Deploy to production
- [ ] Update Stripe webhook endpoints
- [ ] Switch to live Stripe keys
- [ ] Monitor for 24 hours
- [ ] Verify all endpoints
- [ ] Ready to accept payments

---

## 📞 Troubleshooting

### Docker Issues
```bash
# Check if Docker daemon is running
docker ps

# Restart Docker
docker system restart

# Clean up
docker system prune -a
```

### Payment Failures
```bash
# Check Stripe webhook
docker compose logs rwa-bridge | grep webhook

# View payment intent
curl https://api.stripe.com/v1/payment_intents/{intent_id} \
  -u $STRIPE_SECRET_KEY:
```

### Database Issues
```bash
# Check database connection
docker compose exec web-replycontrol npx drizzle-kit check

# Run migrations
docker compose exec web-replycontrol pnpm db:migrate
```

---

## 📈 Scaling

### Horizontal Scaling
```bash
# Docker Compose
docker compose up -d --scale rwa-bridge=3

# Kubernetes
kubectl scale deployment rwa-bridge --replicas=5 -n mindreply
```

### Load Balancing
- Use Nginx/HAProxy for simple load balancing
- Use cloud-native load balancers (ALB, CLB) for cloud deployments
- Configure health checks for automatic failover

---

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
1. Builds Docker images
2. Pushes to ghcr.io
3. Triggers Vercel deployment
4. Runs health checks

### Triggering Deployment
```bash
git push origin main  # Automatically triggers CI/CD
```

---

## 📝 Support & Documentation

- **Docker:** https://docs.docker.com
- **Stripe:** https://docs.stripe.com/payments/machine/mpp
- **Next.js:** https://nextjs.org/docs
- **GitHub Actions:** https://docs.github.com/en/actions

---

**Ready to go live? Follow the Quick Start section above.** 🚀
