# syntax=docker/dockerfile:1

FROM node:20.5.0-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["node", "src/server/main.js"]
