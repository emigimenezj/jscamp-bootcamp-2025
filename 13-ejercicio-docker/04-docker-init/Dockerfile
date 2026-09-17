# Replicamos a mano lo que genera `docker init` para un proyecto Node,
# porque la CLI instalada no incluye el comando (solo viene con Docker Desktop).

# Node 22 LTS sobre Alpine: imagen pequeña y compatible con el proyecto
FROM node:22-alpine

# Producción por defecto: npm instalará solo dependencias necesarias para correr
ENV NODE_ENV=production

# Directorio de trabajo estándar dentro del contenedor
WORKDIR /app

# Copiamos primero solo los manifiestos para aprovechar la caché de Docker:
# si no cambian las dependencias, `npm ci` no se vuelve a ejecutar
COPY package.json package-lock.json ./

# `npm ci` instala exactamente lo que dice el lockfile (builds reproducibles)
# `--omit=dev` porque en producción no necesitamos devDependencies
RUN npm ci --omit=dev

# Ahora sí copiamos el resto del código (server.js)
COPY . .

# Documentamos el puerto donde escucha la app
EXPOSE 3000

# Corremos con el usuario `node` (sin privilegios) por seguridad
USER node

# Comando de inicio en formato exec (mejor manejo de señales, ej. SIGTERM)
CMD ["node", "server.js"]
