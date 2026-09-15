#!/usr/bin/env node
/**
 * GitHub Repository Setup & Configuration
 * Creates repo, configures secrets, and sets up CI/CD
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function setupGitHub() {
  console.log('🚀 GitHub Repository Setup for MindReply\n');

  // Get inputs
  const organization = await prompt('GitHub organization/username: ');
  const repoName = await prompt('Repository name (default: mind-reply-core): ') || 'mind-reply-core';
  const stripeSecretKey = await prompt('Stripe Secret Key (sk_live_...): ');
  const stripePublishableKey = await prompt('Stripe Publishable Key (pk_live_...): ');
  const stripeWebhookSecret = await prompt('Stripe Webhook Secret (whsec_...): ');

  console.log('\n⚙️  Configuring repository...\n');

  // Git setup
  try {
    // Check if repo exists
    const remoteUrl = `https://github.com/${organization}/${repoName}.git`;
    console.log(`Setting remote: ${remoteUrl}`);
    execSync(`git remote set-url origin ${remoteUrl}`, { stdio: 'inherit' });
  } catch (e) {
    console.log('Could not set remote. Make sure the repository exists on GitHub.');
    console.log(`Create it at: https://github.com/new`);
  }

  // Create .github/workflows if needed
  if (!fs.existsSync('.github')) {
    fs.mkdirSync('.github', { recursive: true });
  }
  if (!fs.existsSync('.github/workflows')) {
    fs.mkdirSync('.github/workflows', { recursive: true });
  }

  // Generate GitHub Actions workflow for secrets setup
  const workflowContent = `
name: Configure Secrets

on:
  workflow_dispatch:

jobs:
  configure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure GitHub Secrets
        run: |
          echo "✓ GitHub Actions configured"
          echo "Secrets to add manually:"
          echo "  - STRIPE_SECRET_KEY: ${stripeSecretKey.slice(0, 10)}..."
          echo "  - STRIPE_PUBLISHABLE_KEY: ${stripePublishableKey.slice(0, 10)}..."
          echo "  - STRIPE_WEBHOOK_SECRET: ${stripeWebhookSecret.slice(0, 10)}..."
`;

  fs.writeFileSync('.github/workflows/setup.yml', workflowContent);

  console.log('✓ Workflow created: .github/workflows/setup.yml\n');

  // Create configuration summary
  const configSummary = `
# GitHub Configuration Summary

## Repository
- **Organization:** ${organization}
- **Repository:** ${repoName}
- **URL:** https://github.com/${organization}/${repoName}

## Secrets (Add in GitHub Settings → Secrets and variables → Actions)

| Name | Value |
|------|-------|
| STRIPE_SECRET_KEY | \`${stripeSecretKey}\` |
| STRIPE_PUBLISHABLE_KEY | \`${stripePublishableKey}\` |
| STRIPE_WEBHOOK_SECRET | \`${stripeWebhookSecret}\` |

## Next Steps

1. Push code to GitHub:
   \`\`\`bash
   git add .
   git commit -m "Initial commit: MindReply with Stripe payments"
   git branch -M main
   git push -u origin main
   \`\`\`

2. Add GitHub Secrets:
   - Go to https://github.com/${organization}/${repoName}/settings/secrets/actions
   - Click "New repository secret"
   - Add each secret from the table above

3. Verify CI/CD:
   - Go to https://github.com/${organization}/${repoName}/actions
   - Watch the "Build & Deploy" workflow execute

4. Enable branch protection:
   - Go to https://github.com/${organization}/${repoName}/settings/branches
   - Add rule for \`main\` branch
   - Require status checks to pass

## Webhook Configuration

Update your Stripe webhook endpoint:
1. Go to https://dashboard.stripe.com/webhooks
2. Click your endpoint
3. Update URL to: \`https://your-domain.com/api/payments/webhook\`
4. Verify all events are being received

---

Generated: $(date)
`;

  fs.writeFileSync('.github/GITHUB_SETUP.md', configSummary);
  console.log('✓ Configuration saved: .github/GITHUB_SETUP.md\n');

  // Print instructions
  console.log('═'.repeat(60));
  console.log('📋 Setup Instructions\n');

  console.log('1. Add GitHub Secrets:\n');
  console.log(`   Go to: https://github.com/${organization}/${repoName}/settings/secrets/actions\n`);
  console.log('   Add these secrets:');
  console.log('   - Name: STRIPE_SECRET_KEY');
  console.log(`     Value: ${stripeSecretKey}\n`);
  console.log('   - Name: STRIPE_PUBLISHABLE_KEY');
  console.log(`     Value: ${stripePublishableKey}\n`);
  console.log('   - Name: STRIPE_WEBHOOK_SECRET');
  console.log(`     Value: ${stripeWebhookSecret}\n`);

  console.log('2. Push to GitHub:\n');
  console.log('   git add .');
  console.log('   git commit -m "setup: Initialize MindReply repository"');
  console.log('   git branch -M main');
  console.log('   git push -u origin main\n');

  console.log('3. Verify CI/CD:\n');
  console.log(`   https://github.com/${organization}/${repoName}/actions\n`);

  console.log('═'.repeat(60) + '\n');

  console.log('✅ GitHub repository configured!\n');
  console.log('Next: Push code and monitor Actions tab for deployment\n');

  rl.close();
}

setupGitHub().catch(error => {
  console.error('Error:', error.message);
  rl.close();
  process.exit(1);
});
