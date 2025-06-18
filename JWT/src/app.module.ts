import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./middlewares/auth.middleware";
import { JwtService } from "./jwt/jwt.service";
import { UsersService } from "./entities/users/users.service";
import { RolesModule } from "./entities/roles/roles.module";
import { PermissionsModule } from "./entities/permissions/permissions.module";
import { UsersModule } from "./entities/users/users.module";
import { AuthService } from "./middlewares/auth.services";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "db", 
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