import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtService } from "src/jwt/jwt.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/roles/entities/role.entity";
import { UserEntity } from "./entities/user.entity";
import { AuthService } from "src/middlewares/auth.services";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Role])],
  controllers: [UsersController],
  providers: [UsersService, JwtService, AuthService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
