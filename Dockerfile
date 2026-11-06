# 1. Base Stage with Node.js 22 (Nuxt 4 requires Node >= 22)
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 2. Dependencies Stage
FROM base AS deps
RUN apk add --no-cache openssl libc6-compat
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# 3. Builder Stage
FROM base AS builder
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN pnpm run build

# 4. Production Runner Stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Install OpenSSL for Prisma engine on Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy standalone Nuxt build artifacts (contains all runtime server dependencies)
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
