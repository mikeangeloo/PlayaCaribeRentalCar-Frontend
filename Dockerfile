######## Paso 1
# Especificamos la imagen de node a utilizar
FROM node:16.14.0 AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./

# Instalamos dependecias
RUN npm install

# Copiamos los ficheros
COPY . .

# Compilamos app
RUN npm run build -- --prod


######## Paso 2
# Especificamos la imagen de nginx a utilizar
FROM nginx:latest AS runtime

# Establecer variable de entorno para la URL del backend
ENV BACKEND_URL="backend-service"

# Copiar node_modules desde la etapa de construcción
COPY --from=build /app/node_modules /usr/share/nginx/html/node_modules

# Copiamos los ficheros del build anterior a la carpeta publica html de nginx
COPY --from=build /app/www /usr/share/nginx/html

# Copiar el template de configuración de Nginx
COPY ./config/nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copiar el script de entrada
COPY ./config/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exponemos puerto 80
EXPOSE 80

# Ejecutar el script de entrada antes de iniciar Nginx
CMD ["/entrypoint.sh"]
