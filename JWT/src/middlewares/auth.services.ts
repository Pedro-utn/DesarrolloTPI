import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Role } from "src/entities/roles/role.entity";
import { UserEntity } from "../entities/users/user.entity";
import { UsersService } from "../entities/users/users.service";
import { Repository } from "typeorm";

// Servicio de autenticación y autorización encargado de validar tokents JWT y verificar permisos de usuario dependiendo de su rol y los permisos del mismo

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

  // Valida el token JWT y comprueba si el usuario asociado tiene los permisos necesarios

    async validateTokenAndPermissions(
    token: string,
    requiredPermissions: string[],
    mode: 'any' | 'all' = 'all',
  ): Promise<UserEntity> {
    requiredPermissions = Array.isArray(requiredPermissions) ? requiredPermissions : [];

    if (!token) {
      throw new UnauthorizedException("Token de autenticación no proporcionado.");
    }

    let payload: any;

    try {
      payload = this.jwtService.getPayload(token.replace(/^Bearer\s+/i, ''));
    } catch (error) {
      throw new UnauthorizedException("Token de autenticación inválido o expirado.");
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedException("Token de autenticación inválido: falta información de usuario.");
    }

    const userFound = await this.userRepository.findOne({
      where: { email: payload.email },
      relations: ['rol', 'rol.permissions'], // carga el rol y sus permisos
    });
    if (!userFound) {
      throw new UnauthorizedException("Usuario no encontrado.");
    }

    if (!userFound.rol) {
      throw new UnauthorizedException("El usuario no tiene un rol asignado o no se pudo cargar.");
    }

    const userPermissions = await this.roleRepository.findOne({
      where: { id: userFound.rol.id },
      relations: ["permissions"],
    });

    if (!userPermissions) {
      throw new UnauthorizedException("No se encontró el rol o permisos asociados para el usuario.");
    }

    const permissionsStrings = userPermissions.permissions
      ? userPermissions.permissions.map((p) => p.name)
      : [];

    const hasPermission =
      mode === 'any'
        ? requiredPermissions.some((perm) => permissionsStrings.includes(perm))
        : requiredPermissions.every((perm) => permissionsStrings.includes(perm));

    if (!hasPermission) {
      throw new UnauthorizedException("No tiene permisos suficientes");
    }

    return userFound;
  }
}