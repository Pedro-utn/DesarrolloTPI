import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./auth/middlewares/auth.middleware";
import { JwtService } from "./auth/jwt/jwt.service";
import { UsersService } from "./modules/users/users.service";
import { RolesModule } from "./modules/roles/roles.module";
import { PermissionsModule } from "./modules/permission/permissions.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthService } from "./auth/middlewares/auth.services";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "database-jwt", 
      port: 5432, 
      username: "postgres",
      password: "postgres",
      database: "postgres",
      autoLoadEntities: true,
      synchronize: true,
    }),
    RolesModule,
    PermissionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AuthGuard, JwtService, UsersService, AuthService],
})
export class AppModule {}