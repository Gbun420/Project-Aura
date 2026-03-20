FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
# If you have static assets or other folders needed at runtime, copy them here
# COPY --from=builder /usr/src/app/api ./api 

EXPOSE 8080
ENV PORT=8080

CMD ["node", "dist/index.js"]
