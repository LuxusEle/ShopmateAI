FROM node:18-alpine as builder

WORKDIR /app/client
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/client/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
