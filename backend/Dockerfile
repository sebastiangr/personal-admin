# --- Etapa 1: Build ---
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# No generamos el cliente aquí, lo haremos en la etapa final
RUN npm run build
# El seed ya no se compila aquí, no es necesario para producción por ahora

# --- Etapa 2: Producción ---
FROM node:20
WORKDIR /app

# Copia los archivos de manifiesto
COPY package*.json ./

# ¡CLAVE! En lugar de copiar node_modules, ejecutamos una instalación limpia
# de las dependencias de producción. Esto obliga a NPM a descargar los
# binarios correctos para la arquitectura de la imagen final (ARM).
RUN npm install --only=production

# Copia el schema de Prisma
COPY prisma ./prisma/

# Copia el código JavaScript compilado desde la etapa 'builder'
COPY --from=builder /app/dist ./dist

# ¡CLAVE! Generamos el cliente de Prisma AHORA, en la etapa final.
# Esto asegura que se vincule con el motor binario correcto para ARM.
RUN npx prisma generate

EXPOSE 3000

# El CMD no cambia, pero ahora apunta al código que funcionará
CMD ["node", "dist/index.js"]