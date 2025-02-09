######## Paso 1
# Especificamos la imagen de node a utilizar
FROM node:16.14.0 as build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los ficheros
COPY . .

# Instalamos dependecias
RUN npm install

# Compilamos app
RUN npm run build -- --prod


######## Paso 2
# Especificamos la imagen de nginx a utilizar
FROM nginx:latest AS runtime

# Copiamos los ficheros del build anterior a la carpeta publica html de nginx
COPY --from=build /app/www /usr/share/nginx/html

# Copiamos el archivo nginx para que el proyecto este vigente
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
