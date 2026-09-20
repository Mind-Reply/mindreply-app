# Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Prerequisites
- Docker & Docker Compose installed
- Git

### 1. Clone & Setup

```bash
cd Users/ANGEL
cp .env.example .env.local
```

### 2. Start Services

```bash
docker compose up --pull always
```

### 3. Access the App

- **Frontend**: http://localhost:3000
- **RWA Bridge**: http://localhost:8000
- **Health Monitor**: Running in background

### 4. Verify It Works

```bash
# Check services
docker compose ps

# View logs
docker compose logs -f web-replycontrol
```

---

## 📱 Explore the App

**Home Page** (http://localhost:3000)
- View all 4 "engines"
- Click on engine cards to explore
- Use navbar to navigate

**AI Assistant** (http://localhost:3000/agent)
- Type a question in the text area
- Get AI-powered responses (placeholder)
- Responses are private

**Contact** (http://localhost:3000/contact)
- Submit name, email, message
- Form is ready for backend integration

---

## 🛠️ Make Changes

### Edit Frontend

```bash
# Edit files in apps/replycontrol-web/app/
# Changes hot-reload at http://localhost:3000
```

**Example: Add new page**
```bash
mkdir apps/replycontrol-web/app/my-page
# Create apps/replycontrol-web/app/my-page/page.tsx
# Visit http://localhost:3000/my-page
```

### Restart Services

```bash
# Restart everything
docker compose restart

# Restart specific service
docker compose restart web-replycontrol

# Stop everything
docker compose down
```

---

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Full deployment instructions
- **DEVELOPMENT.md** - Development setup & workflow
- **BUILD_SUMMARY.md** - What was built & next steps

---

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
docker ps | grep 3000
docker stop <container_name>
docker compose up
```

**Services not starting?**
```bash
docker compose logs
docker compose up --build
```

**Want a fresh start?**
```bash
docker compose down -v
docker compose up --pull always
```

---

## ✨ What's Ready

- ✓ Full Next.js frontend with responsive design
- ✓ All main pages (home, engines, contact, privacy)
- ✓ Docker containerization (both frontend & backend)
- ✓ Local development environment
- ✓ Production deployment configs
- ✓ Documentation & guides

---

## 🎯 What's Next

1. **Push to GitHub** - Connect to `mind-reply/mind-reply-core`
2. **Deploy to Vercel** - Frontend goes live
3. **Add Database** - PostgreSQL + Prisma
4. **Implement Auth** - Google OAuth or email signup
5. **Wire up LLM** - Connect to EfficientCore/gateway or external API
6. **Build Features** - Message refinement, profit engine, etc.

---

## 💬 Questions?

Check the documentation files:
- Setup issues? → See DEPLOYMENT_GUIDE.md
- Want to code? → See DEVELOPMENT.md
- What's done? → See BUILD_SUMMARY.md
