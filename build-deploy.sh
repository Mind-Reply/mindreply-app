#!/bin/bash
# MindReply Build & Deploy Script
# Builds, tests, and deploys to production

set -e

echo "🚀 MindReply Build & Deploy Pipeline"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Config
REPO_NAME="mind-reply-core"
IMAGE_RWA_BRIDGE="rwa-bridge:latest"
IMAGE_FRONTEND="web-replycontrol:latest"
REGISTRY="${REGISTRY:-ghcr.io}"

# Step 1: Check prerequisites
echo -e "\n${YELLOW}[1/7]${NC} Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git${NC}"

# Step 2: Build RWA Bridge
echo -e "\n${YELLOW}[2/7]${NC} Building RWA Bridge Docker image..."
docker build -f Dockerfile -t ${IMAGE_RWA_BRIDGE} . --progress=plain
echo -e "${GREEN}✓ RWA Bridge built${NC}"

# Step 3: Build Frontend
echo -e "\n${YELLOW}[3/7]${NC} Building Next.js Frontend image..."
docker build -f apps/web-replycontrol/Dockerfile -t ${IMAGE_FRONTEND} . --progress=plain
echo -e "${GREEN}✓ Frontend built${NC}"

# Step 4: Test locally
echo -e "\n${YELLOW}[4/7]${NC} Testing docker-compose stack locally..."
docker compose config --quiet
echo -e "${GREEN}✓ docker-compose.yml is valid${NC}"

# Step 5: Push to registry (if REGISTRY_USER & REGISTRY_PASSWORD set)
if [ -n "$REGISTRY_USER" ] && [ -n "$REGISTRY_PASSWORD" ]; then
    echo -e "\n${YELLOW}[5/7]${NC} Pushing images to registry..."
    echo "$REGISTRY_PASSWORD" | docker login -u "$REGISTRY_USER" --password-stdin "$REGISTRY"
    
    docker tag ${IMAGE_RWA_BRIDGE} ${REGISTRY}/${REGISTRY_USER}/${REPO_NAME}/rwa-bridge:latest
    docker push ${REGISTRY}/${REGISTRY_USER}/${REPO_NAME}/rwa-bridge:latest
    echo -e "${GREEN}✓ Pushed rwa-bridge${NC}"
    
    docker tag ${IMAGE_FRONTEND} ${REGISTRY}/${REGISTRY_USER}/${REPO_NAME}/web-replycontrol:latest
    docker push ${REGISTRY}/${REGISTRY_USER}/${REPO_NAME}/web-replycontrol:latest
    echo -e "${GREEN}✓ Pushed web-replycontrol${NC}"
else
    echo -e "\n${YELLOW}[5/7]${NC} Skipping registry push (set REGISTRY_USER & REGISTRY_PASSWORD)${NC}"
fi

# Step 6: Git commit & push
if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "\n${YELLOW}[6/7]${NC} Pushing to GitHub..."
    git add .
    git commit -m "build: Auto-deploy at $(date)" || true
    git push -u origin main
    echo -e "${GREEN}✓ Pushed to GitHub${NC}"
else
    echo -e "\n${YELLOW}[6/7]${NC} Skipping GitHub push (set GITHUB_TOKEN)${NC}"
fi

# Step 7: Deploy
echo -e "\n${YELLOW}[7/7]${NC} Deployment instructions..."
echo -e "${GREEN}✓ Ready to deploy!${NC}"
echo ""
echo "Local deployment:"
echo "  docker compose up -d"
echo ""
echo "Cloud deployment:"
echo "  docker stack deploy -c docker-compose.yml mindreply"
echo ""
echo "Kubernetes deployment:"
echo "  kubectl apply -f k8s/"
echo ""

echo -e "\n${GREEN}✅ Build pipeline complete!${NC}"
echo "Next: Configure Stripe keys and deploy to production"
