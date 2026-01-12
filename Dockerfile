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

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/nuxt.config.ts ./
COPY --from=builder /app/i18n.config.ts ./
COPY --from=builder /app/package.json ./

# Expose the port Nuxt.js runs on
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", ".output/server/index.mjs"]
