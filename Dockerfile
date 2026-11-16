# Multi-stage build for Node.js Next.js application
# Stage 1: Dependencies (cached layer)
FROM node:26-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.32.1 --silent

# Copy monorepo workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Install dependencies (with cache optimization)
RUN pnpm install --frozen-lockfile --prod=false

---

# Stage 2: Builder
FROM node:26-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.32.1 --silent

# Copy from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run database migrations
RUN pnpm run db:migrate

# Build application
RUN pnpm run build

---

# Stage 3: Runtime (optimized for production)
FROM node:26-alpine AS runner
RUN apk add --no-cache libc6-compat dumb-init
WORKDIR /app

# Install pnpm for runtime
RUN npm install -g pnpm@10.32.1 --silent

# Create non-root user
RUN addgroup --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/pnpm-lock.yaml pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules

# Runtime environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start application
CMD ["pnpm", "start"]
