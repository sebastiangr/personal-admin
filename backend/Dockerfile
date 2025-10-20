# Dockerfile for the backend service
# --- Etapa 1: Build ---
# Usamos una imagen completa de Node para la compilación
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias para poder compilar
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Generamos el cliente de Prisma
RUN npx prisma generate

# Compilamos el código TypeScript a JavaScript en la carpeta /dist
RUN npm run build


# --- Etapa 2: Producción ---
# Empezamos desde una imagen limpia y ligera
FROM node:20-alpine

WORKDIR /app

# Copiamos las dependencias de producción desde la etapa 'builder'
COPY --from=builder /app/node_modules ./node_modules

# Copiamos el package.json (necesario para 'npm start')
COPY package*.json ./

# Copiamos el schema de Prisma (necesario para las migraciones en producción)
COPY --from=builder /app/prisma ./prisma

# Copiamos el código JavaScript compilado desde la etapa 'builder'
COPY --from=builder /app/dist ./dist

# Exponemos el puerto en el que la aplicación escucha
EXPOSE 3000

# El comando para iniciar la aplicación de producción
CMD ["npm", "run", "start"]