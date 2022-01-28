FROM node:9.11.1-alpine

# creando carpeta de trabajo
WORKDIR app/

# copiando archivos a esta direccion
COPY . .

# instalando dependencias
RUN npm install

# exponiendo el puerto a usar
EXPOSE 8080

# iniciar la aplicacion
CMD ["npm", "start"]
