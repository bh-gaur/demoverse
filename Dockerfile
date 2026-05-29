# Stage 1: Build Next.js application
FROM node:20-alpine AS builder
WORKDIR /app

# Install apk build dependencies
RUN apk add --no-cache openssl

# Install dependencies first (for docker layer caching)
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Production runner environment
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install OpenSSL for Prisma SQLite support
RUN apk add --no-cache openssl

# Copy build artifacts and dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/tsconfig.json ./

# Expose port 3000
EXPOSE 3000

# Copy and configure entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
