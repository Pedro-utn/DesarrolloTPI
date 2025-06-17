import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Role } from "src/roles/entities/role.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async validateTokenAndPermissions(
    token: string,
    requiredPermissions: string[],
  ): Promise<UserEntity> {
    const payload = this.jwtService.getPayload(token);
    const user = await this.usersService.findByEmail(payload.email);

    console.log(`token: ${token}`);
    console.log(`requiredPermissions ${requiredPermissions}`);
    const userFound = await this.userRepository.findOneBy({ id: user.id });
    console.log(`userMail: ${userFound.email}`);
    const userPermissions = await this.roleRepository.findOne({
      where: { id: userFound.id },
      relations: ["permissions"],
    });

    console.log(`userPermissions: ${userPermissions.name}`);

    const permissionsStrings = userPermissions.permissions.map((p) => p.name);
    const hasAllPermissions = requiredPermissions.every((perm) =>
      permissionsStrings.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new UnauthorizedException("No tiene permisos suficientes");
    }

    return user;
  }
}
