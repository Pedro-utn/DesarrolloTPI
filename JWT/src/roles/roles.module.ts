import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Permission } from "src/permissions/entities/permission.entity";
import { UsersService } from "src/users/users.service";
import { JwtService } from "src/jwt/jwt.service";
import { AuthService } from "src/middlewares/auth.services";

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserEntity, Permission])],
  controllers: [RolesController],
  providers: [RolesService, AuthService, JwtService, UsersService],
})
export class RolesModule {}
