FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY server.js .
COPY config/    ./config/
COPY models/    ./models/
COPY controllers/ ./controllers/
COPY routes/    ./routes/

EXPOSE 3000

CMD ["node", "server.js"]
