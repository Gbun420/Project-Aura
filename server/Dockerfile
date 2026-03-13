# Use Node.js production image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install curl for health checks
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["npm", "run", "dev"]
