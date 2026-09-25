# Security Policy

## Reported Vulnerabilities

All Dependabot security alerts have been addressed:

### Fixed Dependencies
- `react` → ^19.1.0
- `react-dom` → ^19.1.0
- `next` → ^15.5.21 (latest stable)
- `tailwindcss` → ^4.0.1
- `postcss` → ^8.4.45
- `autoprefixer` → ^10.4.20
- `typescript` → ^5.6.2
- `@types/node` → ^20.16.5
- `@types/react` → ^18.3.5

### How to Apply Fixes

1. **Update all dependencies:**
   ```bash
   npm install
   npm audit fix --force
   ```

2. **Verify no vulnerabilities remain:**
   ```bash
   npm audit
   ```

3. **Rebuild and test:**
   ```bash
   npm run build
   npm run dev
   ```

## Prevention

- Dependabot is configured to auto-create PRs for security updates
- All PRs must pass CI/CD before merging
- Never commit `.env` files
- Use `.env.local` for local development
- Store production secrets in a secrets manager (AWS Secrets Manager, Vault, etc.)

## Reporting

If you find a security vulnerability:
- DO NOT open a public issue
- Email: security@mind-reply.com
- Include: description, reproduction steps, impact, suggested fix

---

**Last Updated:** August 5, 2026
