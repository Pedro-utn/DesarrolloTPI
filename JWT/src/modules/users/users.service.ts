import { HttpException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import { LoginDTO } from "src/modules/interfaces/login.dto";
import { RegisterDTO } from "src/modules/interfaces/register.dto";
import { UserI } from "src/modules/interfaces/user.interface";
import { UserEntity } from "./entities/user.entity";
import { hashSync, compareSync } from "bcrypt";
import { JwtService } from "src/auth/jwt/jwt.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../roles/entities/role.entity";
import { Repository } from "typeorm";
import { IdOnlyRolDto } from "../roles/roles.service";

export type CreateUserDto = {
  email:string;
  password: string;
}

export type UpdateUserDto = {
  name?: string;
  password?: string;
  id_rol: IdOnlyRolDto
}

export type UpdateUserRole = {
  rol: IdOnlyRolDto
}


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

  async register(body: RegisterDTO) {
    try {
      const user = new UserEntity();
      Object.assign(user, body);
      user.password = hashSync(user.password, 10);
      const defaultRole = await this.roleRepository.findOneBy({ name: "user" });

      if (!defaultRole) {
        throw new NotFoundException("Rol predeterminado no encontrado");
      }
      user.rol = defaultRole;
      await this.repository.save(user);

      return { status: "Usuario creado" };
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
      throw new NotFoundException("No se encontró ningún usuario que coincida");
    }
    
    const foundRol = await this.roleRepository.findOneBy({
      id: rol.id,
    });

    if (!foundRol) {
      throw new NotFoundException("Rol no encontrado");
    }

    userFound.rol = foundRol;
    await this.repository.save(userFound);

    return "Rol actualizado";
  }

  

}
