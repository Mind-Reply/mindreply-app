# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Status: READY FOR DEPLOYMENT

**Last Updated**: 2026-08-07  
**Deployment Strategy**: Multi-cloud (Vercel + Railway + AWS/GCP/Azure)  
**Revenue Target**: $92K/mo across 8 services  

---

## WAVE 1: IMMEDIATE DEPLOYMENT (This Week)

### Prerequisites
- [ ] GitHub secrets configured (see below)
- [ ] Vercel projects created and linked
- [ ] Railway account authenticated
- [ ] Environment variables in `.env.production`

### Step 1: Configure GitHub Secrets

Add these to your GitHub repository settings (`Settings > Secrets and variables > Actions`):

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID_CORE=your_project_id

RAILWAY_TOKEN=your_railway_token
RAILWAY_PROJECT_ID=your_project_id

SLACK_WEBHOOK=https://hooks.slack.com/services/...
```

### Step 2: Deploy to Vercel (Frontend)

```bash
# Vercel will auto-deploy on merge to main
git push origin main
```

**Expected Output:**
- ✓ GitHub Actions workflow triggered
- ✓ Build successful (npm run build)
- ✓ Deployed to https://mind-reply.vercel.app
- ✓ Health checks passing

### Step 3: Deploy to Railway (Backend)

```bash
# Connect Railway to GitHub
# Railway will auto-deploy on push to main
git push origin main
```

**Expected Services:**
- ✓ PostgreSQL running on port 5432
- ✓ Redis running on port 6379
- ✓ Node backend running
- ✓ RWA bridge (Python) running on port 8000

### Step 4: Local Verification

```bash
# Test locally before pushing to production
docker-compose -f docker-compose.prod.yml up -d

# Verify services are healthy
curl http://localhost:3001/health  # MindReply
curl http://localhost:3002/health  # A11-K
curl http://localhost:8000/health  # RWA Bridge

# View monitoring dashboards
open http://localhost:9090  # Prometheus
open http://localhost:3100  # Grafana (admin/admin)
```

---

## WAVE 2: BACKEND HARDENING (Week 2)

### Step 1: Setup Stripe Integration

```bash
# Add Stripe webhooks to your Stripe Dashboard
# Webhook URL: https://api.mind-reply.com/webhooks/stripe
# Events: charge.succeeded, subscription.updated, customer.subscription.deleted
```

### Step 2: Setup Clerk Authentication

```bash
# Create Clerk project and add to environment variables
# Update .env.production with Clerk keys
```

### Step 3: Configure Database Backups

```bash
# Railway provides automated backups
# Configure daily backups to S3 (optional)
```

---

## WAVE 3: MULTI-CLOUD EXPANSION (Weeks 3-4)

### AWS (APEX Stack)

```bash
# Push Docker images to AWS ECR
aws ecr get-login-password | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker tag mind-reply-core:main 123456789.dkr.ecr.us-east-1.amazonaws.com/mind-reply-core:main
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/mind-reply-core:main

# Deploy to ECS
aws ecs create-service --cluster production --service-name mind-reply --task-definition mind-reply:1 --desired-count 3
```

### GCP (NEXUS Stack)

```bash
# Deploy to Cloud Run
gcloud run deploy mind-reply-core --source . --platform managed --region us-central1
```

### Azure (SENTINEL Stack)

```bash
# Deploy to Container Instances
az container create --resource-group production --name mind-reply-core --image acr.azurecr.io/mind-reply-core:main
```

---

## MONITORING & ALERTS

### Real-time Dashboards

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3100 (admin / your_password)
- **Service Health**: Check endpoints at `:3000/health`, `:8000/health`

### Slack Alerts

Configure in `.env.production`:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

All critical alerts will post to your Slack channel.

### Key Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | ≥ 99.5% | < 99.5% |
| API Response Time | < 200ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| CPU Usage | < 70% | > 90% |
| Memory Usage | < 80% | > 95% |
| Database Connections | < 80 | > 100 |

---

## TROUBLESHOOTING

### Services not starting?

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs -f mindreply-web
docker-compose -f docker-compose.prod.yml logs -f rwa-bridge

# Check database connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U mindreply -d mindreply -c "SELECT 1"
```

### Port already in use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in docker-compose.prod.yml
```

### Out of memory?

```bash
# Free up Docker resources
docker system prune -a --volumes
docker builder prune
```

---

## REVENUE ACTIVATION

Once deployed, activate revenue streams:

### 1. AI Arena (Fastest)
- Deploy to Vercel ✓
- Add Stripe integration
- Launch at ai-arena.vercel.app
- **Expected MRR**: $1-3K

### 2. MindReply SaaS
- Add pricing page
- Implement subscription flow
- Email onboarding sequence
- **Expected MRR**: $2-5K

### 3. A11-K Platform
- Setup B2B lead funnel
- Configure CRM integration
- Launch outreach campaign
- **Expected MRR**: $8-15K

### 4. AUREL Ops API
- Deploy to Railway ✓
- Generate OpenAPI docs
- Publish SDKs (JS, Python)
- **Expected MRR**: $2-5K

---

## SUCCESS CRITERIA

- [ ] All services running and healthy
- [ ] CI/CD pipeline automated
- [ ] Monitoring active (Prometheus + Grafana)
- [ ] First revenue transaction complete
- [ ] Health endpoints returning 200 OK
- [ ] Logs flowing to central location
- [ ] Alerts configured in Slack
- [ ] Database backups scheduled
- [ ] SSL/TLS certificates valid
- [ ] Team trained on deployment process

---

## NEXT STEPS

1. **Push this repo**: `git push origin main`
2. **Monitor GitHub Actions**: Check workflow at https://github.com/angellllkr-eng/mind-reply-core/actions
3. **Verify deployments**: Check Vercel and Railway dashboards
4. **Activate Stripe**: Complete Stripe integration
5. **Launch revenue**: Begin first monetization flow
6. **Scale**: Add remaining services in Wave 2 & 3

---

**Questions?** Check `.github/workflows/deploy-prod.yml` for CI/CD pipeline details or `docker-compose.prod.yml` for service configuration.

**Status**: READY TO DEPLOY 🚀
