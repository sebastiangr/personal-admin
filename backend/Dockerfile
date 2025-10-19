# Dockerfile for the backend service

# 1. Base Image: 
FROM node:20-alpine

# 2. Working Directory: 
WORKDIR /app

# 3. Copy package files: 
COPY package*.json ./

# 4. Install Dependencies: 
RUN npm install --only=production

# 5. Copy App Source Code: 
COPY . .

# 6. Build TypeScript to JavaScript: 
RUN npm install
RUN npm run build
# RUN npm prune --production

# 7. Generate Prisma Client: 
RUN npx prisma generate

# 8. Expose Port: 
EXPOSE 3000

# 9. Start Command: El comando que se ejecutará cuando el contenedor inicie. Ejecutamos el código compilado.
CMD ["node", "dist/index.js"]
