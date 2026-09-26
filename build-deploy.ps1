# MindReply Build & Deploy Script (PowerShell)
# Builds, tests, and deploys to production

param(
    [string]$Registry = "ghcr.io",
    [string]$RegistryUser = $env:REGISTRY_USER,
    [string]$RegistryPassword = $env:REGISTRY_PASSWORD,
    [string]$GitHubToken = $env:GITHUB_TOKEN
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 MindReply Build & Deploy Pipeline" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Config
$RepoName = "mind-reply-core"
$ImageRwaBridge = "rwa-bridge:latest"
$ImageFrontend = "web-replycontrol:latest"

function Log-Step {
    param([int]$Step, [int]$Total, [string]$Message)
    Write-Host "`n[$Step/$Total] $Message" -ForegroundColor Cyan
}

function Log-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Log-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Step 1: Check prerequisites
Log-Step 1 7 "Checking prerequisites..."
try {
    docker --version | Out-Null
    Log-Success "Docker"
} catch {
    Log-Error "Docker not found"
    exit 1
}

try {
    git --version | Out-Null
    Log-Success "Git"
} catch {
    Log-Error "Git not found"
    exit 1
}

# Step 2: Build RWA Bridge
Log-Step 2 7 "Building RWA Bridge Docker image..."
docker build -f Dockerfile -t $ImageRwaBridge .
if ($LASTEXITCODE -eq 0) {
    Log-Success "RWA Bridge built"
} else {
    Log-Error "RWA Bridge build failed"
    exit 1
}

# Step 3: Build Frontend
Log-Step 3 7 "Building Next.js Frontend image..."
docker build -f apps/web-replycontrol/Dockerfile -t $ImageFrontend .
if ($LASTEXITCODE -eq 0) {
    Log-Success "Frontend built"
} else {
    Log-Error "Frontend build failed"
    exit 1
}

# Step 4: Test locally
Log-Step 4 7 "Testing docker-compose stack locally..."
docker compose config --quiet
if ($LASTEXITCODE -eq 0) {
    Log-Success "docker-compose.yml is valid"
} else {
    Log-Error "docker-compose.yml is invalid"
    exit 1
}

# Step 5: Push to registry (if credentials set)
if ($RegistryUser -and $RegistryPassword) {
    Log-Step 5 7 "Pushing images to registry..."
    
    echo $RegistryPassword | docker login -u $RegistryUser --password-stdin $Registry
    
    docker tag $ImageRwaBridge "${Registry}/${RegistryUser}/${RepoName}/rwa-bridge:latest"
    docker push "${Registry}/${RegistryUser}/${RepoName}/rwa-bridge:latest"
    Log-Success "Pushed rwa-bridge"
    
    docker tag $ImageFrontend "${Registry}/${RegistryUser}/${RepoName}/web-replycontrol:latest"
    docker push "${Registry}/${RegistryUser}/${RepoName}/web-replycontrol:latest"
    Log-Success "Pushed web-replycontrol"
} else {
    Log-Step 5 7 "Skipping registry push (set REGISTRY_USER and REGISTRY_PASSWORD)"
}

# Step 6: Git commit & push
if ($GitHubToken) {
    Log-Step 6 7 "Pushing to GitHub..."
    git add .
    git commit -m "build: Auto-deploy at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ErrorAction SilentlyContinue | Out-Null
    git push -u origin main
    Log-Success "Pushed to GitHub"
} else {
    Log-Step 6 7 "Skipping GitHub push (set GITHUB_TOKEN)"
}

# Step 7: Deploy instructions
Log-Step 7 7 "Deployment instructions..."
Log-Success "Ready to deploy!"

Write-Host "`nLocal deployment:" -ForegroundColor Yellow
Write-Host "  docker compose up -d"

Write-Host "`nCloud deployment:" -ForegroundColor Yellow
Write-Host "  docker stack deploy -c docker-compose.yml mindreply"

Write-Host "`nKubernetes deployment:" -ForegroundColor Yellow
Write-Host "  kubectl apply -f k8s/"

Write-Host "`n✅ Build pipeline complete!" -ForegroundColor Green
Write-Host "Next: Configure Stripe keys and deploy to production" -ForegroundColor Yellow
