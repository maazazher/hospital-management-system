# Dockerfile
#  Stage 1: Base Image 
# Use official Node.js image (Alpine = tiny Linux, only 5MB!)
FROM node:18-alpine
#  Stage 2: Working Directory 
# Create and set /app as our working directory inside the container
WORKDIR /app
#  Stage 3: Install Dependencies 
# Copy ONLY package.json first (smart caching — faster rebuilds!)
COPY package*.json ./
# Install all dependencies
RUN npm install --production
#  Stage 4: Copy App Code 
# Copy all our source code into the container
COPY . .
#  Stage 5: Security 
# Create a non-root user (security best practice!)
RUN addgroup -g 1001 -S nodejs && \
adduser -S nodeuser -u 1001
USER nodeuser
#  Stage 6: Expose Port 
# Tell Docker this container uses port 3000
EXPOSE 3000
#  Stage 7: Health Check 
# Docker will ping this endpoint to check if the app is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
CMD wget -qO- http://localhost:3000/health || exit 1
#  Stage 8: Start Command 
# This command runs when the container starts
CMD ["node", "src/server.js"]
