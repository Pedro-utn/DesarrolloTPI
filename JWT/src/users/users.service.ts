import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDTO } from "src/interfaces/login.dto";
import { RegisterDTO } from "src/interfaces/register.dto";
import { UserI } from "src/interfaces/user.interface";
import { UserEntity } from "./entities/user.entity";
import { hashSync, compareSync } from "bcrypt";
import { JwtService } from "src/jwt/jwt.service";
import { UpdateUserRole } from "./dto/update-user-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/entities/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private jwtService: JwtService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshToken(refreshToken);
  }

  // canDo(user: UserI, permission: string): boolean {
  //   console.log(`Permission pedido: ${permission}`);
  //   const result = user.permissionCodes.includes(permission);
  //   if (!result) {
  //     throw new UnauthorizedException();
  //   }
  //   return true;
  // }

  async register(body: RegisterDTO) {
    try {
      const user = new UserEntity();
      Object.assign(user, body);
      user.password = hashSync(user.password, 10);
      const defaultRole = await this.roleRepository.findOneBy({ code: "user" });

      if (!defaultRole) {
        throw new NotFoundException("Default Role not found");
      }
      user.rol = defaultRole;
      await this.repository.save(user);

      return { status: "created" };
    } catch (error) {
      throw new HttpException("Error de creacion", 500);
    }
  }

  async login(body: LoginDTO) {
    const user = await this.findByEmail(body.email);
    if (user == null) {
      throw new UnauthorizedException();
    }
    const compareResult = compareSync(body.password, user.password);
    if (!compareResult) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: this.jwtService.generateToken({ email: user.email }, "auth"),
      refreshToken: this.jwtService.generateToken(
        { email: user.email },
        "refresh",
      ),
    };
  }
  async findByEmail(email: string): Promise<UserEntity> {
    return await this.repository.findOneBy({ email });
  }

  async updateRol(id: number, updateUserRol: UpdateUserRole): Promise<string> {
    const { rol } = updateUserRol;

    const userFound = await this.repository.findOneBy({ id: id });

    if (!userFound) {
      throw new NotFoundException("No matching user found");
    }
    const foundRol = await this.roleRepository.findOneBy({
      code: rol.code,
    });

    if (!foundRol) {
      throw new NotFoundException("No matching rol found");
    }

    userFound.rol = foundRol;
    this.repository.save(userFound);

    return "Rol updated sucessfully";
  }
}
