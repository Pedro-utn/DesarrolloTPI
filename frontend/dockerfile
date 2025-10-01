# Etapa 1: Build de la app Angular
FROM node:20 AS build

WORKDIR /app

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar archivos necesarios
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto por defecto de Angular
EXPOSE 4200

# Comando por defecto: correr Angular en modo desarrollo
CMD ["ng", "serve", "--host", "0.0.0.0"]
