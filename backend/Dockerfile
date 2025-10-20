# --- Etapa 1: Build Dependencies & Source Code ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia solo los archivos de manifiesto e instala TODAS las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Compila el código TypeScript a JavaScript
RUN npm run build


# --- Etapa 2: Production Image ---
FROM node:20-alpine

WORKDIR /app

# Copia los archivos de manifiesto de nuevo
COPY package*.json ./

# ¡CLAVE! Instala SOLO las dependencias de producción.
# Esto asegura que cualquier binario nativo (como el de Prisma)
# se descargue para el entorno final correcto (Alpine Linux en ARM).
RUN npm install --only=production

# Copia el schema de Prisma desde el builder
COPY --from=builder /app/prisma ./prisma

# Copia el código JavaScript compilado desde el builder
COPY --from=builder /app/dist ./dist

# ¡CLAVE! Vuelve a generar el cliente de Prisma en el entorno final.
# Esto lo vincula con el binario correcto que se acaba de instalar.
RUN npx prisma generate

# Expone el puerto que la aplicación usa internamente
EXPOSE 3000

# El comando de inicio no cambia
CMD ["node", "dist/index.js"]