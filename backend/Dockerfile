# Dockerfile for the backend service

# 1. Base Image: Usamos una imagen oficial de Node.js ligera (basada en Alpine Linux)
FROM node:18-alpine

# 2. Working Directory: Creamos y establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copy package files: Copiamos primero package.json y package-lock.json
# Esto aprovecha el sistema de caché de Docker. Si estos archivos no cambian, no se volverán a instalar las dependencias.
COPY package*.json ./

# 4. Install Dependencies: Instalamos solo las dependencias de producción para mantener la imagen ligera
RUN npm install --only=production

# 5. Copy App Source Code: Copiamos el resto de los archivos de nuestro backend al contenedor
COPY . .

# 6. Build TypeScript to JavaScript: Compilamos el código TypeScript a JavaScript en la carpeta /dist
# Necesitamos las devDependencies para esto, así que las instalamos, compilamos y luego las eliminamos.
RUN npm install
RUN npm run build
RUN npm prune --production

# 7. Generate Prisma Client: Nos aseguramos de que el cliente de Prisma se genere dentro del entorno del contenedor
RUN npx prisma generate

# 8. Expose Port: Le decimos a Docker que el contenedor escuchará en el puerto 3000
EXPOSE 3000

# 9. Start Command: El comando que se ejecutará cuando el contenedor inicie. Ejecutamos el código compilado.
CMD ["node", "dist/index.js"]
