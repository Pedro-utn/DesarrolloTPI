import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { UserEntity } from "../users/entities/user.entity";
import { Permission } from "../permission/entities/permission.entity";
import { UsersService } from "../users/users.service";
import { JwtService } from "../../auth/jwt/jwt.service";
import { AuthService } from "../../auth/middlewares/auth.services";

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserEntity, Permission])],
  controllers: [RolesController],
  providers: [RolesService, AuthService, JwtService, UsersService],
})
export class RolesModule {}
