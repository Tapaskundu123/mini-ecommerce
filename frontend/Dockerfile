# ==============================
# Stage 1 — Dependencies
# ==============================
FROM node:18-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci


# ==============================
# Stage 2 — Builder
# ==============================
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# build arg from CI/CD
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# ensure public directory exists even if empty to prevent COPY failure
RUN mkdir -p public

RUN npm run build


# ==============================
# Stage 3 — Runner
# ==============================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# standalone output (always exists if next.config.js is correct)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# public folder may or may not exist — safe copy pattern (using trailing slash)
COPY --from=builder /app/public/ ./public/

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
