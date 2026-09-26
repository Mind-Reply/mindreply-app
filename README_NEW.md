# MindReply – AI Agent Payment & RWA Integration Platform

> **Autonomous agent payments + Real-world asset acquisition via Stripe Machine Payments**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/mind-reply/mind-reply-core/actions)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://docker.com)
[![Stripe](https://img.shields.io/badge/stripe-MPP%20%2B%20x402-blueviolet)](https://stripe.com)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

---

## 🎯 Overview

MindReply is a production-ready platform for autonomous agents to:

- **Pay autonomously** via Stripe Machine Payments Protocol (MPP) and x402 stablecoin payments
- **Acquire real-world assets** (RWA) programmatically through legal entity wrappers
- **Execute multi-step workflows** without human intervention
- **Settle payments instantly** in fiat or stablecoin

**Tech Stack:**
- Frontend: **Next.js 16.2** + React 19 + TypeScript
- Backend: **Python** + FastAPI + Stripe SDK
- Database: **Supabase** (PostgreSQL)
- Payments: **Stripe** (MPP + x402)
- Deployment: **Docker Compose** + GitHub Actions + Vercel

---

## 🚀 Quick Start

### 1. Local Development (2 minutes)

```bash
# Clone and enter directory
cd MindReply-personal-current

# Copy environment template
cp .env.production.example .env.local

# Edit .env.local with your Stripe test keys
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_test_...

# Start services
docker compose up --pull always

# Test endpoints
curl http://localhost:3000/api/health      # Frontend ✓
curl http://localhost:8000/health          # RWA Bridge ✓
```

### 2. GitHub Setup (3 minutes)

```bash
# Configure GitHub repository
node setup-github.js

# Follow prompts to add Stripe keys as GitHub secrets
# Then push to GitHub:
git add .
git commit -m "Initial commit: MindReply with Stripe payments"
git branch -M main
git push -u origin main
```

### 3. Deploy to Production (5 minutes)

**Option A: Local/Self-hosted**
```bash
docker compose -f docker-compose.prod.yml up -d
```

**Option B: Cloud (DigitalOcean, AWS, Azure, etc.)**
See [LIVE_DEPLOYMENT.md](./LIVE_DEPLOYMENT.md) for cloud-specific guides.

---

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Agent / Client                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ Frontend │   │ Payments │   │  RWA    │
    │ 3000     │   │ API      │   │ Bridge  │
    │ Next.js  │   │ /api/*   │   │ 8000    │
    └────┬────┘   └────┬────┘   └────┬────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
              ┌────────▼────────┐
              │  Stripe Payments │
              │  (MPP + x402)    │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Supabase DB     │
              │  (PostgreSQL)    │
              └──────────────────┘
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [BUILD_DEPLOYMENT_PLAN.md](./BUILD_DEPLOYMENT_PLAN.md) | Complete build & deployment strategy |
| [LIVE_DEPLOYMENT.md](./LIVE_DEPLOYMENT.md) | Production deployment guide (local, cloud, k8s) |
| [STRIPE_SETUP.md](./STRIPE_SETUP.md) | Stripe account setup & integration |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Original deployment documentation |
| [MICROSERVICES.md](./MICROSERVICES.md) | Service architecture & contracts |

---

## 🔑 API Reference

### Payment Endpoints

#### `POST /api/payments`
Create payment challenge for agent

**Request:**
```json
{
  "agent_id": "agent-123",
  "service_type": "rwa_bridge",
  "amount_cents": 50,
  "currency": "usd",
  "payment_method": "spt"
}
```

**Response (200):**
```json
{
  "payment_id": "pi_1234567890abcdef",
  "client_secret": "pi_1234567890abcdef_secret_xyz",
  "amount": 50,
  "currency": "usd",
  "expires_at": 1694894400
}
```

#### `GET /api/payments/{payment_id}`
Check payment status

**Response:**
```json
{
  "payment_id": "pi_1234567890abcdef",
  "status": "succeeded",
  "amount": 50,
  "currency": "usd",
  "agent_id": "agent-123",
  "service_type": "rwa_bridge"
}
```

#### `POST /api/payments/webhook`
Stripe webhook (auto-called by Stripe)

**Events handled:**
- `payment_intent.succeeded` → Execute service
- `payment_intent.payment_failed` → Log and retry

### RWA Bridge Endpoints

#### `GET /health`
Health check

#### `GET /`
Service info

#### `POST /acquire`
Acquire real-world asset

#### `POST /payments/challenge`
Create payment challenge (alternative)

#### `POST /acquire-with-payment`
Acquire asset only after payment verified

---

## 🔐 Security

### Pre-Production Checklist

- [ ] All secrets in `.env` (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled (reverse proxy/load balancer)
- [ ] Health checks passing
- [ ] Rate limiting configured (10 req/min per agent)
- [ ] Monitoring & alerting enabled
- [ ] Backups automated
- [ ] Firewall configured
- [ ] Stripe webhook endpoint configured
- [ ] Database backups enabled

### Environment Variables

**Required:**
- `STRIPE_SECRET_KEY` – Stripe API key (sk_live_...)
- `STRIPE_PUBLISHABLE_KEY` – Stripe public key (pk_live_...)
- `STRIPE_WEBHOOK_SECRET` – Webhook signing secret (whsec_...)

**Optional:**
- `NODE_ENV` – Environment (default: production)
- `SUPABASE_URL` – Database URL
- `SUPABASE_SECRET_KEY` – Auth secret
- `AGENT_WALLET_ADDRESS` – Default agent wallet

---

## 🧪 Testing

### Local Testing

```bash
# Run integration tests
node test-payments.js

# Test payment flow manually
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "test-agent",
    "service_type": "rwa_bridge",
    "amount_cents": 50,
    "currency": "usd",
    "payment_method": "spt"
  }'

# Check logs
docker compose logs -f web-replycontrol
docker compose logs -f rwa-bridge
```

### Stripe Test Mode

Use these test card numbers in Stripe Dashboard:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Authentication required:** 4000 0025 0000 3155

---

## 📊 Monitoring

### Health Checks

```bash
# Frontend
curl http://localhost:3000/api/health

# RWA Bridge
curl http://localhost:8000/health

# All services
docker compose ps
```

### Logs

```bash
# Follow all logs
docker compose logs -f

# Specific service
docker compose logs -f rwa-bridge
docker compose logs -f web-replycontrol

# Last 100 lines
docker compose logs --tail=100
```

### Stripe Dashboard

- **Payments:** https://dashboard.stripe.com/payments
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Logs:** https://dashboard.stripe.com/logs
- **API Keys:** https://dashboard.stripe.com/apikeys

---

## 🚢 Deployment Options

### Local Development
```bash
docker compose up --pull always
```

### Production (Self-hosted)
```bash
docker stack deploy -c docker-compose.yml mindreply
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

### Cloud Platforms
- **DigitalOcean:** App Platform or Droplets
- **AWS:** ECS, Fargate, or Lambda
- **Azure:** Container Instances
- **Heroku:** Container Registry

See [LIVE_DEPLOYMENT.md](./LIVE_DEPLOYMENT.md) for detailed guides.

---

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
1. Builds Docker images on push to `main`
2. Pushes to ghcr.io (GitHub Container Registry)
3. Deploys frontend to Vercel
4. Runs health checks

**Triggering deployment:**
```bash
git push origin main  # Automatically starts CI/CD
```

---

## 📦 Project Structure

```
mindreply-personal-current/
├── apps/
│   ├── web-replycontrol/           # Next.js frontend
│   │   ├── app/
│   │   │   ├── api/payments/       # Payment endpoints
│   │   │   ├── api/health/         # Health check
│   │   │   └── ...
│   │   └── Dockerfile              # Frontend image
│   └── ...
├── apex_titan_rwa_bridge.py         # RWA Bridge service (FastAPI + Stripe)
├── docker-compose.yml               # Local dev composition
├── docker-compose.prod.yml          # Production composition
├── requirements.txt                 # Python dependencies
├── package.json                     # Node.js dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml               # CI/CD workflow
├── Dockerfile                       # RWA Bridge image
├── STRIPE_SETUP.md                  # Stripe integration guide
├── BUILD_DEPLOYMENT_PLAN.md         # Deployment strategy
├── LIVE_DEPLOYMENT.md               # Production guide
└── README.md                        # This file
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Push and create a Pull Request
4. Wait for CI/CD to pass
5. Merge to `main`

---

## 📞 Support

- **Stripe:** https://docs.stripe.com/payments/machine/mpp
- **Docker:** https://docs.docker.com
- **Next.js:** https://nextjs.org/docs
- **GitHub Issues:** Create an issue in this repo

---

## 📄 License

MIT License – See [LICENSE](./LICENSE) for details

---

## 🎯 Roadmap

- [ ] Multi-region agent deployment
- [ ] Advanced RWA acquisition patterns
- [ ] Stablecoin payment analytics
- [ ] Custom webhook routing
- [ ] Agent credit system
- [ ] Payment dispute handling
- [ ] Compliance reporting

---

**Status:** ✅ Ready for Production  
**Last Updated:** 2026-09-15  
**Version:** 1.0.0

---

<div align="center">

**Ready to go live?** 🚀

Start with [Quick Start](#-quick-start) above, then see [LIVE_DEPLOYMENT.md](./LIVE_DEPLOYMENT.md)

</div>
