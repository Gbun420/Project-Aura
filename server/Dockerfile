# Use Node.js production image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
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
