FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app files
COPY . .

# Expose the API port
EXPOSE 4000

# Use persistent DB path if available
ENV DB_PATH=/data/data.db

CMD ["node", "server.js"]
COPY data.db /data/data.db
