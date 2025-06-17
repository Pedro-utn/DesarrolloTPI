import { Module } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { AuthService } from "src/middlewares/auth.services";
import { JwtService } from "src/jwt/jwt.service";
import { UsersService } from "src/users/users.service";
import { Role } from "src/roles/entities/role.entity";
import { UserEntity } from "src/users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, UserEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService, AuthService, JwtService, UsersService],
})
export class PermissionsModule {}
