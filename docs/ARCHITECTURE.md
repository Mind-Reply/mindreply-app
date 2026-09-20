# MindReply Architecture

## System Overview

MindReply is a unified AI/LLM platform with a monorepo architecture supporting two branded surfaces:
- **MindReply Core** (mindreply.com) — Primary platform
- **A11-K** (a11-k.space) — Voice-first AI companion

---

## Elysium Stack (Sovereign Control Plane)

The **Elysium Stack** is the sovereign enterprise intelligence substrate that sits above product surfaces. It interlocks three layers under a single control plane so that expert intent, runtime quality, and cryptographic provenance become executable law.

| Layer | Role | Package |
|-------|------|---------|
| **Aurelia** | Domain Expert Sovereignty (NL/visual → deterministic config) | `packages/aurelia` |
| **Lumenforge** | Quality as Executable Law (Edge Middleware contracts) | `packages/lumenforge` |
| **Veridex** | Provenance-First Ledger (immutable `.epack` receipts) | `packages/veridex` |
| **Elysium Core** | Shared types + Helix Protocol | `packages/elysium-core` |

Full architecture, orchestration loop, and commercial positioning: **[docs/ELYSIUM_STACK.md](./ELYSIUM_STACK.md)**  
Epic: **#38**

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 | Web UIs for both brands |
| **Backend** | Python FastAPI | RWA acquisition engine |
| **Database** | PostgreSQL 16 | Persistent data storage |
| **Cache** | Redis 7 | Session management & caching |
| **Orchestration** | Docker Compose | Local & production deployment |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Hosting** | Docker (mindreply.com) + Vercel (a11-k.space) | Production deployment |
| **Edge Quality** | Vercel Edge Middleware (Lumenforge) | Runtime contract enforcement |
| **Immutable Ledger** | Supabase + RLS + SHA-256 (Veridex) | Cryptographic provenance |

---

## Service Architecture

```
┌─────────────────────────────────────────┐
│        External Users / API Clients     │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────────┐        ┌──────────────┐
│ mindreply   │        │    a11k      │
│  Core UI    │        │  Surface UI  │
│ Next.js:3000│        │ Next.js:3001 │
└─────────────┘        └──────────────┘
    │                         │
    └────────────┬────────────┘
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌──────────────┐      ┌─────────────────┐
│ Shared Auth  │      │  RWA Bridge     │
│ & Services   │      │ Python:8000     │
│              │      │ Legal Entity    │
│              │      │ Integration     │
└──────────────┘      └─────────────────┘
    │                          │
    ├──────────────┬───────────┤
    │              │           │
    ▼              ▼           ▼
┌─────────────────────────────────┐
│   Shared Infrastructure         │
├─────────────────────────────────┤
│ PostgreSQL 16 (mindreply_db)    │
│ Redis 7 (session & cache)       │
│ Health Check Monitor            │
│ Veridex Ledger (Supabase)       │
└─────────────────────────────────┘
```

---

## Data Flow

### User Authentication & Session

1. User logs in via MindReply Core or A11-K UI
2. NextAuth validates credentials
3. Session token stored in Redis
4. Cookie set in browser (httpOnly, Secure)
5. Subsequent requests validated against Redis cache

### RWA Acquisition

1. User initiates RWA request via Web UI
2. Request forwarded to Python RWA Bridge (port 8000)
3. Bridge validates agent wallet & session key
4. Integration with Legal Entity API (OtoCo)
5. Response cached in Redis
6. UI displays result

### Database Persistence

- User profiles, settings → PostgreSQL
- Session tokens, temporary data → Redis
- Audit logs, transactions → PostgreSQL (write-once)
- Elysium envelopes → Veridex / Supabase append-only (SHA-256)

### Elysium Orchestration Loop

1. Intent Capture (Aurelia)
2. Contract Verification (Lumenforge vs Helix Protocol)
3. Cryptographic Stamping (Veridex)
4. Execution & Delivery

---

## Deployment Topology

### Development (Local)

```bash
docker compose up --pull always
```

All services run in single Docker network (`mindreply-network`) on localhost.

### Production (mindreply.com)

- **Hosting:** Self-hosted (Docker) or cloud (AWS, DigitalOcean, etc.)
- **Load Balancer:** Nginx or cloud CDN
- **Database:** Managed PostgreSQL (production-grade)
- **Cache:** Redis cluster or managed service
- **Backups:** Daily automated snapshots

### Production (a11-k.space)

- **Hosting:** Vercel (serverless)
- **Edge:** Vercel's global edge network + Lumenforge Middleware
- **Database:** PostgreSQL (shared with mindreply.com)
- **Cache:** Redis (shared with mindreply.com)
- **Ledger:** Supabase (Veridex)
- **Backups:** Vercel snapshots + manual backups

---

## Monorepo Structure

### Apps Layer

```
apps/
├── web-replycontrol/        # Core platform UI
│   ├── app/
│   │   ├── root.tsx         # Root shell with <Outlet />
│   │   ├── routes/
│   │   │   └── _index.tsx   # Homepage /
│   │   └── ...
│   └── package.json
│
├── a11k/                    # A11-K branded UI
│   ├── app/
│   │   ├── root.tsx
│   │   ├── routes/
│   │   │   └── _index.tsx
│   │   └── ...
│   └── package.json
│
├── marketing/               # Landing pages
│   └── ...
│
└── experimental/
    ├── brushworks/          # Design studio (staging)
    └── forge/               # Scaffolding (staging)
```

### Services Layer

```
services/
└── rwa-bridge/
    ├── apex_titan_rwa_bridge.py  # Main service
    ├── requirements.txt           # Python deps
    ├── Dockerfile                 # Container build
    └── ...
```

### Shared Layer

```
packages/
├── elysium-core/            # Helix Protocol + shared types
├── aurelia/                 # Expert intent compiler
├── lumenforge/              # Edge contract evaluator
├── veridex/                 # Cryptographic ledger
├── a11-fleet/               # Fleet registry & tasks
├── shared-ui/               # Reusable React components
├── shared-config/           # Environment & schemas
└── shared-types/            # TypeScript definitions
```

---

## Security Model

### Environment Isolation

- Development: `.env.local` (local overrides)
- Production: GitHub Actions secrets + environment variables
- No credentials baked into Docker images

### Network Security

- Docker services communicate via named network
- Non-root user runs containers
- Health checks detect failures
- Database credentials rotated regularly

### API Security

- NextAuth handles session validation
- HTTPS enforced (both domains)
- CORS headers properly configured
- Rate limiting on sensitive endpoints
- Lumenforge enforces Helix contracts at the edge before delivery

### Provenance

- Veridex writes append-only, SHA-256 hashed envelopes under Supabase RLS
- Every high-stakes action produces a signed `.epack` receipt

---

## Scaling Strategy

### Horizontal Scaling (Multiple Instances)

```bash
# Run multiple mindreply-web containers behind load balancer
docker-compose -p mindreply-1 up -d
docker-compose -p mindreply-2 up -d
# Route traffic via Nginx upstream
```

### Vertical Scaling (Larger Instances)

```yaml
# Increase resource limits in docker-compose
services:
  mindreply-web:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### Database Scaling

- Read replicas for PostgreSQL (production)
- Redis cluster for distributed caching
- Connection pooling via PgBouncer

---

## Monitoring & Observability

### Health Checks

- Container health checks enabled
- Healthcheck monitor service (every 60s in prod)
- Logs aggregated to stdout

### Metrics

```bash
# View container stats
docker stats

# View logs
docker compose logs -f mindreply-web
docker compose logs -f rwa-bridge
```

### Alerting

- Vercel: Built-in error tracking
- Self-hosted: Configure external monitoring (Datadog, New Relic, etc.)

---

## References

- [Elysium Stack](./ELYSIUM_STACK.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Operating Model](./OPERATING_MODEL.md)
- [Operations Runbook](./OPERATIONS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
