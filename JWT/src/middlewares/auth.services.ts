import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Role } from "src/entities/roles/role.entity";
import { UserEntity } from "../entities/users/user.entity";
import { UsersService } from "../entities/users/users.service";
import { Repository } from "typeorm";

// Servicio de autenticación y autorización
// Encargado de validar tokents JWT y verificar permisos de usuario
// dependiendo de su rol y los permisos del mismo

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
  ): Promise<UserEntity> {

    // Asegura que requiredPermissions sea siempre un array para evitar errores
    // medida defensiva si el decorador @Permissions no devuelve un array

    requiredPermissions = Array.isArray(requiredPermissions) ? requiredPermissions : [];

    // Verifica si el token está presente

    if (!token) {
      throw new UnauthorizedException("Token de autenticación no proporcionado.");
    }

    let payload: any;

    // Decodificación y verificación del JWT

    try {
      // Elimina el prefijo 'Bearer' si está presente antes de verificar el token
      payload = this.jwtService.getPayload(token.replace(/^Bearer\s+/i, ''));
    } catch (error) {

      // Captura y lanza una excepción si el token es inválido o ha expirado

      throw new UnauthorizedException("Token de autenticación inválido o expirado.");
    }

    // Verificación del payload del token (debe contener el email)

    if (!payload || !payload.email) {
      throw new UnauthorizedException("Token de autenticación inválido: falta información de usuario.");
    }

    // Búsqueda del usuario en la base de datos por email del payload

    const userFound = await this.userRepository.findOne({
      where: { email: payload.email },
      relations: ['rol'], // Asegura cargar la relación con el rol del usuario
    });

    if (!userFound) {
      throw new UnauthorizedException("Usuario no encontrado.");
    }

    // Verificación de que el usuario tiene un rol asignado

    if (!userFound.rol) {
      throw new UnauthorizedException("El usuario no tiene un rol asignado o no se pudo cargar.");
    }

    // Búsqueda de los permisos asociados al rol del usuario

    const userPermissions = await this.roleRepository.findOne({
      where: { id: userFound.rol.id },
      relations: ["permissions"], // Carga las relaciones de permisos para el rol
    });

    if (!userPermissions) {
      throw new UnauthorizedException("No se encontró el rol o permisos asociados para el usuario.");
    }

    // Extracción de los nombres de los permisos del usuario
    // Si no hay permisos asociados, se usa un array vacío para evitar errores

    const permissionsStrings = userPermissions.permissions
      ? userPermissions.permissions.map((p) => p.name)
      : [];

    // Verificación de que el usuario tiene los permisos requeridos

    const hasAllPermissions = requiredPermissions.every((perm) =>
      permissionsStrings.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new UnauthorizedException("No tiene permisos suficientes");
    }

    // Si todas las validaciones son exitosas, retorna el usuario
    
    return userFound;
  }
}