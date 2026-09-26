# Multi-stage Node.js build for ResellerPro billing engine
# Build context: repository root

FROM node:26-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm@10.32.1 --silent

# Workspace manifests for monorepo resolution
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY services/resellerpro-engine/package.json ./services/resellerpro-engine/
COPY packages ./packages

RUN pnpm install --frozen-lockfile --filter=resellerpro-engine...

# ---- Builder ----
FROM node:26-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm@10.32.1 --silent

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/resellerpro-engine/node_modules ./services/resellerpro-engine/node_modules
COPY . .

ENV NODE_ENV=production
ENV STRIPE_API_VERSION=2024-11-20

# Build TypeScript → JavaScript
RUN pnpm --filter resellerpro-engine build

# ---- Production runtime ----
FROM node:26-alpine AS production
RUN apk add --no-cache libc6-compat dumb-init
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN npm install -g pnpm@10.32.1 --silent

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built app and minimal runtime dependencies
COPY --from=builder /app/services/resellerpro-engine/dist ./services/resellerpro-engine/dist
COPY --from=builder /app/services/resellerpro-engine/package.json ./services/resellerpro-engine/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/resellerpro-engine/node_modules ./services/resellerpro-engine/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Log directory for audit trail
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

WORKDIR /app/services/resellerpro-engine
USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=2 --start-period=10s \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
