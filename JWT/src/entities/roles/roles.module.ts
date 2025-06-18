import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./role.entity";
import { UserEntity } from "../users/user.entity";
import { Permission } from "src/entities/permissions/permission.entity";
import { UsersService } from "../users/users.service";
import { JwtService } from "src/jwt/jwt.service";
import { AuthService } from "src/middlewares/auth.services";

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserEntity, Permission])],
  controllers: [RolesController],
  providers: [RolesService, AuthService, JwtService, UsersService],
})
export class RolesModule {}
