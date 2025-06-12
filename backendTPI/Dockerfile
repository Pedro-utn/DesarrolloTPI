# Usa una imagen oficial de Node.js (elige la versión que necesites)
FROM node:18.19.1

# Directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias primero para aprovechar caché de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto (si es necesario)
RUN npm run build

# Puerto expuesto (el que usa NestJS, por defecto 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD npm run start:dev             # ← Formato shell
