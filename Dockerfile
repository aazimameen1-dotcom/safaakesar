# Base Node 22 image
FROM node:22-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
WORKDIR /app
COPY safa-kesar/package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY safa-kesar ./
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/lib/db.ts ./src/lib/db.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
