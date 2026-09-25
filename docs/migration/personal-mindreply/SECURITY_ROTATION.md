# Security rotation guidance

We removed the repository .env contents and replaced with this guidance to ensure any exposed dev keys are rotated.

Steps to follow immediately if secrets were committed:

1. Identify what keys may have been exposed (OpenAI, Vercel, Cloudflare, DB credentials).
2. Revoke each exposed secret in its provider console and create new credentials.
3. Update the new credentials in the repository Secrets (GitHub) and/or deployment environment (Vercel, Azure).
4. Rotate any downstream keys or integration tokens that may have used the old credentials.
5. If production credentials were exposed, audit logs and rotate keys for affected services and notify stakeholders.

Suggested owners and timeline:
- Owner: repo admin / security lead
- Timeline: rotate immediately (0–24 hours) for production keys; 72 hours for dev keys.

Reference commands:
- GitHub: Settings → Secrets & variables → Actions
- Vercel: Project Settings → Environment Variables
