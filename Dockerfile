# Stage 1: Build the Nuxt.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Nuxt.js application
RUN npm run build

# Stage 2: Serve the application with a minimal production image
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production dependencies + drizzle-kit and pg for migrations
COPY package*.json ./
RUN npm install --only=production && npm install drizzle-kit pg tsx

# Copy built application from builder stage
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/nuxt.config.ts ./
COPY --from=builder /app/i18n.config.ts ./
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/drizzle.docker.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server/database ./server/database

# Generate migrations at build time
RUN npm run db:generate || true

# Expose the port Nuxt.js runs on
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", ".output/server/index.mjs"]
