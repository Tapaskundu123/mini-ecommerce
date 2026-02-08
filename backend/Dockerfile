# ---------- Dependencies ----------
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev


# ---------- Build ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci


# ---------- Production ----------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# copy app code first
COPY --from=build /app ./

# then overwrite with prod node_modules
COPY --from=deps /app/node_modules ./node_modules

# non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

EXPOSE 5000

CMD ["npm", "start"]
