# Development Guide

## Project Structure

```
mind-reply/
├── apps/
│   └── web-replycontrol/           # Next.js frontend
│       ├── app/                    # App router (pages, layouts)
│       ├── public/                 # Static assets
│       ├── Dockerfile              # Container image
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── services/
│   └── rwa-bridge/                 # Python RWA service (future)
│
├── docker-compose.yml              # Local development
├── docker-compose.prod.yml         # Production deployment
├── Dockerfile                      # RWA Bridge image
├── apex_titan_rwa_bridge.py        # RWA engine
└── requirements.txt
```

## Frontend Development

### Technology Stack
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript
- **Testing**: Jest (add as needed)

### Key Files

**app/layout.tsx** - Root layout with metadata
**app/page.tsx** - Home page
**app/globals.css** - Global styles & Tailwind directives
**app/[page]/page.tsx** - Dynamic pages

### Adding a New Page

```bash
# Create page file
mkdir app/new-page
touch app/new-page/page.tsx
```

**app/new-page/page.tsx:**
```tsx
'use client';

import Link from 'next/link';

export default function NewPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Your content */}
    </div>
  );
}
```

### Styling Guide

**Color Palette:**
- Primary: `#142237` (dark navy)
- Accent: `#d9b866` (gold)
- Background: `#faf9f6` (off-white)
- Text: `#172235` (dark)
- Secondary: `#68717e` (gray)

**Spacing:**
- Use Tailwind units: `px-4`, `py-6`, `gap-8`
- Responsive: `lg:text-6xl`, `sm:px-6 lg:px-10`

**Components:**
- Buttons: `rounded-full bg-[#142237] px-7 py-4 text-white`
- Cards: `rounded-3xl border border-white/80 p-8 shadow-[0_18px_60px_...]`
- Links: Use Next.js `Link` component

### Hot Reload Development

```bash
npm run dev
# Server runs on http://localhost:3000
# Changes reload instantly
```

## Backend Development (RWA Bridge)

### Setup

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running Locally

```bash
python apex_titan_rwa_bridge.py
# Service runs on http://localhost:8000
```

### Key Files

**apex_titan_rwa_bridge.py** - RWA acquisition engine
**requirements.txt** - Python dependencies

### Adding API Endpoints

Update `apex_titan_rwa_bridge.py` with new methods in `RealWorldAssetBridge` class:

```python
async def new_endpoint(self, param: str) -> dict:
    """Docstring"""
    logger.info(f"Processing {param}")
    # Implementation
    return {"result": "value"}
```

## Testing

### Frontend

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build
npm run build
```

### Backend

```bash
# Run locally
python apex_titan_rwa_bridge.py

# Test imports
python -c "import httpx; print('OK')"
```

## Docker Development

### Build Locally

```bash
# Frontend
docker build -t mind-reply:dev apps/replycontrol-web

# RWA Bridge
docker build -t rwa-bridge:dev .
```

### Run with Docker Compose

```bash
docker compose up --build

# View logs
docker compose logs -f

# Restart service
docker compose restart web-replycontrol
```

### Debug Container

```bash
# Shell into running container
docker compose exec web-replycontrol sh

# Check environment
docker compose exec web-replycontrol env

# View process logs
docker compose logs web-replycontrol --tail=50
```

## Making Changes

### Frontend Changes
1. Edit `.tsx` files in `app/`
2. Next.js hot-reloads automatically
3. Test at `http://localhost:3000`
4. Push to GitHub (triggers Vercel deployment)

### Backend Changes
1. Edit `apex_titan_rwa_bridge.py`
2. Restart: `docker compose restart rwa-bridge`
3. Check logs: `docker compose logs rwa-bridge`
4. Push to GitHub (triggers Docker image build)

### Environment Configuration
1. Edit `.env.local` locally
2. Update `.env.example` with new keys
3. Set secrets in GitHub Actions & Vercel dashboards

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-feature

# After review & merge
git checkout main
git pull origin main
```

## Debugging

### Frontend Debugging
- Chrome DevTools: Open http://localhost:3000 and press F12
- Next.js debug logs: `NODE_DEBUG=next npm run dev`
- TypeScript errors: `npm run lint`

### Backend Debugging
- Python logging: Check `docker compose logs rwa-bridge`
- Add debug logs: `logger.debug(f"Debug: {variable}")`
- Test locally: `python apex_titan_rwa_bridge.py`

## Performance

### Frontend Optimization
- Next.js static prerendering enabled
- Images optimized via Next.js Image component
- CSS minification automatic
- Lazy loading for routes

### Backend Optimization
- Async operations (asyncio)
- Connection pooling (httpx)
- Request caching (add as needed)

## Common Tasks

### Deploy to Vercel
```bash
vercel deploy --prod
```

### Build Docker images for registry
```bash
docker build -t ghcr.io/org/mind-reply:latest apps/replycontrol-web
docker push ghcr.io/org/mind-reply:latest
```

### Run production build locally
```bash
npm run build
npm run start
```

### Check for security vulnerabilities
```bash
npm audit
pip check
```
