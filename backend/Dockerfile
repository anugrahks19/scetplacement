FROM node:20-alpine

# Fix Prisma binary compatibility on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 4000

# Wait for postgres then run migrations + start server
CMD ["npm", "run", "dev"]
