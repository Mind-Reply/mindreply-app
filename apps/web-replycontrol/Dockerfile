# Monorepo-aware multi-stage build for web-replycontrol
# Build context MUST be the repository root (see docker-compose.yml).

FROM node:26-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm@10.32.1 --silent

# Workspace manifests first for better layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web-replycontrol/package.json ./apps/web-replycontrol/
# Copy package manifests for workspace deps so install resolves correctly
COPY packages ./packages

RUN pnpm install --frozen-lockfile --filter=web-replycontrol...

# ---- Builder ----
FROM node:26-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm@10.32.1 --silent

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web-replycontrol/node_modules ./apps/web-replycontrol/node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build only this app
RUN pnpm --filter web-replycontrol build

# ---- Production runtime ----
FROM node:26-alpine AS production
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN npm install -g pnpm@10.32.1 --silent

# Copy the built app and minimal runtime needs
COPY --from=builder /app/apps/web-replycontrol/.next ./apps/web-replycontrol/.next
COPY --from=builder /app/apps/web-replycontrol/package.json ./apps/web-replycontrol/package.json
COPY --from=builder /app/apps/web-replycontrol/public ./apps/web-replycontrol/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web-replycontrol/node_modules ./apps/web-replycontrol/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

WORKDIR /app/apps/web-replycontrol
EXPOSE 3000

# Health endpoint is /api/health
CMD ["pnpm", "start"]
