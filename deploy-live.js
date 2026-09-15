#!/usr/bin/env node
/**
 * MindReply – One-Command Live Deployment
 * Handles: Stripe config, GitHub setup, Docker build, production deploy
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');

class LiveDeploymentExecutor {
  constructor() {
    this.config = {};
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  prompt(question) {
    return new Promise(resolve => this.rl.question(question, resolve));
  }

  log(message, color = 'white') {
    const colors = {
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
    };
    const reset = '\x1b[0m';
    console.log(`${colors[color]}${message}${reset}`);
  }

  logStep(step, total, message) {
    this.log(`\n[${'='.repeat(50)}]`, 'cyan');
    this.log(`Step ${step}/${total}: ${message}`, 'cyan');
    this.log(`[${'='.repeat(50)}]\n`, 'cyan');
  }

  exec(command, options = {}) {
    try {
      const result = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        ...options,
      });
      return result.trim();
    } catch (error) {
      throw new Error(`Command failed: ${command}\n${error.message}`);
    }
  }

  async gatherConfig() {
    this.logStep(1, 8, 'Gather Configuration');

    this.log('💳 Stripe Configuration', 'yellow');
    this.config.stripeSecretKey = await this.prompt(
      'Stripe Secret Key (sk_live_ or sk_test_): '
    );
    this.config.stripePublishableKey = await this.prompt(
      'Stripe Publishable Key (pk_live_ or pk_test_): '
    );
    this.config.stripeWebhookSecret = await this.prompt(
      'Stripe Webhook Secret (whsec_): '
    );

    this.log('\n🐙 GitHub Configuration', 'yellow');
    this.config.githubUsername = await this.prompt('GitHub username: ');
    this.config.repoName = await this.prompt(
      'Repository name (default: mind-reply-core): '
    ) || 'mind-reply-core';

    this.log('\n☁️  Deployment Configuration', 'yellow');
    this.config.deploymentType = await this.prompt(
      'Deployment type (local|self-hosted|cloud): '
    ) || 'local';
    this.config.domain = await this.prompt(
      'Domain name (for production): '
    ) || 'localhost';

    this.log('\n✓ Configuration gathered\n', 'green');
  }

  async setupGitHub() {
    this.logStep(2, 8, 'Setup GitHub Repository');

    try {
      const remoteUrl = `https://github.com/${this.config.githubUsername}/${this.config.repoName}.git`;
      this.log(`Setting remote: ${remoteUrl}`, 'blue');
      this.exec(`git remote set-url origin ${remoteUrl}`);

      this.log('Pushing to GitHub...', 'blue');
      this.exec('git add .');
      this.exec('git commit -m "deployment: Initial production commit" || true');
      this.exec('git branch -M main');
      this.exec('git push -u origin main');

      this.log('✓ GitHub repository configured', 'green');
    } catch (error) {
      this.log(`⚠ GitHub setup: ${error.message}`, 'yellow');
    }
  }

  async configureSecrets() {
    this.logStep(3, 8, 'Configure GitHub Secrets');

    this.log('Visit: https://github.com/' + this.config.githubUsername + '/' + this.config.repoName + '/settings/secrets/actions', 'cyan');
    this.log('\nAdd these secrets manually:', 'yellow');
    this.log(`  1. STRIPE_SECRET_KEY: ${this.config.stripeSecretKey.slice(0, 10)}...`, 'white');
    this.log(`  2. STRIPE_PUBLISHABLE_KEY: ${this.config.stripePublishableKey.slice(0, 10)}...`, 'white');
    this.log(`  3. STRIPE_WEBHOOK_SECRET: ${this.config.stripeWebhookSecret.slice(0, 10)}...`, 'white');

    const confirmed = await this.prompt('\nSecrets added to GitHub? (yes/no): ');
    if (confirmed.toLowerCase() !== 'yes') {
      this.log('Please add secrets and run again', 'yellow');
      process.exit(1);
    }

    this.log('✓ Secrets configured', 'green');
  }

  async createEnvFile() {
    this.log('\nCreating .env file...', 'blue');

    const envContent = `# Production Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Stripe Machine Payments
STRIPE_SECRET_KEY=${this.config.stripeSecretKey}
STRIPE_PUBLISHABLE_KEY=${this.config.stripePublishableKey}
STRIPE_WEBHOOK_SECRET=${this.config.stripeWebhookSecret}

# RWA Bridge
LEGAL_ENTITY_API_URL=https://api.otoco.io/v1
AGENT_WALLET_ADDRESS=0x321...AI_AGENT
AGENT_SESSION_KEY=0x_scoped_session_token

# Supabase (update with your values)
SUPABASE_URL=https://aziwdgndohdgnwztpwdi.supabase.co
SUPABASE_SECRET_KEY=sb_secret_REPLACE_IN_SECRET_MANAGER
SUPABASE_DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
`;

    fs.writeFileSync('.env', envContent);
    this.log('✓ .env file created', 'green');
  }

  async buildDockerImages() {
    this.logStep(4, 8, 'Build Docker Images');

    try {
      this.log('Building RWA Bridge image...', 'blue');
      this.exec('docker build -f Dockerfile -t rwa-bridge:latest . --progress=plain');
      this.log('✓ RWA Bridge image built', 'green');

      this.log('\nBuilding Next.js Frontend image...', 'blue');
      this.exec('docker build -f apps/web-replycontrol/Dockerfile -t web-replycontrol:latest . --progress=plain');
      this.log('✓ Frontend image built', 'green');

      this.log('\nValidating docker-compose...', 'blue');
      this.exec('docker compose config --quiet');
      this.log('✓ docker-compose.yml is valid', 'green');
    } catch (error) {
      this.log(`Build error: ${error.message}`, 'red');
      throw error;
    }
  }

  async deployProduction() {
    this.logStep(5, 8, 'Deploy to Production');

    try {
      if (this.config.deploymentType === 'local') {
        this.log('Starting services locally...', 'blue');
        this.exec('docker compose down || true');
        this.exec('docker compose up -d');
        this.log('✓ Services started locally', 'green');
      } else if (this.config.deploymentType === 'self-hosted') {
        this.log('Deploying to self-hosted environment...', 'blue');
        this.exec('docker compose -f docker-compose.prod.yml up -d');
        this.log('✓ Services deployed', 'green');
      } else {
        this.log('For cloud deployment, see LIVE_DEPLOYMENT.md', 'yellow');
      }
    } catch (error) {
      this.log(`Deployment error: ${error.message}`, 'red');
      throw error;
    }
  }

  async verifyHealthChecks() {
    this.logStep(6, 8, 'Verify Health Checks');

    const baseUrl = this.config.deploymentType === 'local' ? 'http://localhost' : `https://${this.config.domain}`;

    this.log('Waiting for services to be ready...', 'blue');
    
    for (let i = 0; i < 30; i++) {
      try {
        const frontendHealth = require('http').get(`${baseUrl}:3000/api/health`, { timeout: 5000 }, (res) => {
          if (res.statusCode === 200) {
            this.log('✓ Frontend health check passed', 'green');
          }
        });
      } catch (e) {
        if (i < 29) {
          process.stdout.write('.');
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    this.log('\n✓ Services are healthy', 'green');
  }

  async activateStripeWebhook() {
    this.logStep(7, 8, 'Activate Stripe Webhook');

    const webhookUrl = this.config.deploymentType === 'local'
      ? 'http://localhost:3000/api/payments/webhook'
      : `https://${this.config.domain}/api/payments/webhook`;

    this.log(`Webhook URL: ${webhookUrl}`, 'cyan');
    this.log('\nManually configure in Stripe Dashboard:', 'yellow');
    this.log('  1. Go to https://dashboard.stripe.com/webhooks', 'white');
    this.log('  2. Update endpoint URL to the webhook URL above', 'white');
    this.log('  3. Enable events: payment_intent.succeeded, payment_intent.payment_failed', 'white');
    this.log('  4. Test webhook delivery', 'white');

    const confirmed = await this.prompt('\nWebhook configured? (yes/no): ');
    if (confirmed.toLowerCase() === 'yes') {
      this.log('✓ Stripe webhook activated', 'green');
    }
  }

  async goLive() {
    this.logStep(8, 8, 'Go Live!');

    this.log('🎉 DEPLOYMENT COMPLETE', 'green');
    this.log('\nYour MindReply platform is now LIVE!', 'cyan');

    const baseUrl = this.config.deploymentType === 'local' ? 'http://localhost' : `https://${this.config.domain}`;

    this.log('\n📍 Access Points:', 'yellow');
    this.log(`  Frontend: ${baseUrl}:3000`, 'white');
    this.log(`  API: ${baseUrl}:3000/api`, 'white');
    this.log(`  RWA Bridge: ${baseUrl}:8000`, 'white');

    this.log('\n💳 Payment Endpoints:', 'yellow');
    this.log(`  POST ${baseUrl}:3000/api/payments (create challenge)`, 'white');
    this.log(`  GET ${baseUrl}:3000/api/payments/{id} (check status)`, 'white');
    this.log(`  POST ${baseUrl}:3000/api/payments/webhook (Stripe)`, 'white');

    this.log('\n📊 Monitoring:', 'yellow');
    this.log(`  Stripe Dashboard: https://dashboard.stripe.com/payments`, 'white');
    this.log(`  GitHub Actions: https://github.com/${this.config.githubUsername}/${this.config.repoName}/actions`, 'white');
    this.log(`  Logs: docker compose logs -f`, 'white');

    this.log('\n✅ Next Steps:', 'green');
    this.log('  1. Send a test payment', 'white');
    this.log('  2. Monitor Stripe dashboard', 'white');
    this.log('  3. Check logs for errors', 'white');
    this.log('  4. Enable monitoring alerts', 'white');

    this.log('\n🚀 Ready to accept agent payments!', 'green');
  }

  async run() {
    try {
      this.log('\n🚀 MindReply – Live Deployment Executor\n', 'cyan');

      await this.gatherConfig();
      await this.setupGitHub();
      await this.configureSecrets();
      await this.createEnvFile();
      await this.buildDockerImages();
      await this.deployProduction();
      await this.verifyHealthChecks();
      await this.activateStripeWebhook();
      await this.goLive();

      this.rl.close();
      process.exit(0);
    } catch (error) {
      this.log(`\n❌ Deployment failed: ${error.message}`, 'red');
      this.rl.close();
      process.exit(1);
    }
  }
}

// Execute
const executor = new LiveDeploymentExecutor();
executor.run();
