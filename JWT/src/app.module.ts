// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { AuthGuard } from './middlewares/auth.middleware';
import { JwtService } from './jwt/jwt.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Cambiado de 'sqlite' a 'postgres'
      host: 'database', // El nombre del servicio de la base de datos en docker-compose.yml
      port: 5432, // El puerto interno por defecto de PostgreSQL en el contenedor
      username: 'postgres', // Coincide con POSTGRES_USER en docker-compose.yml
      password: '1234', // Coincide con POSTGRES_PASSWORD en docker-compose.yml
      database: 'db_jwt', // Nombre de la base de datos (ver nota importante abajo)
      entities,
      synchronize: true, // Esto mantendrá la creación automática de tablas
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [AppController, UsersController],
  providers: [AuthGuard, JwtService, UsersService],
})
export class AppModule {}