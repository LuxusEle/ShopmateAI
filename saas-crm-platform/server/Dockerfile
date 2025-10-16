FROM node:18-alpine

WORKDIR /app/server

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm install -g ts-node typescript

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "run", "start"]
