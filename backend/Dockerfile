# --- Etapa 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

# 1. Compila la aplicación principal (src -> dist)
RUN npm run build

# 2. Compila el seed por separado. Usamos las opciones de tsconfig en la línea de comandos
# para asegurar que se compile correctamente sin interferir con el build principal.
RUN npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --resolveJsonModule --module commonjs --target es2020

# --- Etapa 2: Producción ---
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
RUN npx prisma generate

EXPOSE 3000
# El CMD ahora apunta a la ubicación correcta
CMD ["node", "dist/index.js"]