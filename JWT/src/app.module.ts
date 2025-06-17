import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./middlewares/auth.middleware";
import { JwtService } from "./jwt/jwt.service";
import { UsersService } from "./users/users.service";
import { RolesModule } from "./roles/roles.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { UsersModule } from "./users/users.module";
import { AuthService } from "./middlewares/auth.services";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 4444,
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