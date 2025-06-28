// src/middlewares/auth.services.ts

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Role } from "src/entities/roles/role.entity";
import { UserEntity } from "../entities/users/user.entity";
import { UsersService } from "../entities/users/users.service"; // Keep this if you use it elsewhere, though its findByEmail is now less critical here
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService, // Keep if needed for other methods, or remove if only this service uses it implicitly
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async validateTokenAndPermissions(
    token: string,
    requiredPermissions: string[],
  ): Promise<UserEntity> {

    console.log("Iniciando validacion de credenciales")
    
    const payload = this.jwtService.getPayload(token);


    const userFound = await this.userRepository.findOne({
      where: { email: payload.email }, // Use email from payload directly
      relations: ['rol'], // IMPORTANT: Load the related Role entity
    });

    if (!userFound) {
      throw new UnauthorizedException("Usuario no encontrado.");
    }

    console.log(`token: ${token}`);
    console.log(`requiredPermissions ${requiredPermissions}`);
    console.log(`Usuario: ${userFound.email}`);

    // Check if the user's role was loaded, defensive programming
    if (!userFound.rol) {
      throw new UnauthorizedException("El usuario no tiene un rol asignado o no se pudo cargar.");
    }

    // Access the role's ID from the loaded 'rol' relation
    const userPermissions = await this.roleRepository.findOne({
      where: { id: userFound.rol.id }, // CORRECTED: Access the ID of the related Role object
      relations: ["permissions"], // Load the permissions associated with the role
    });

    if (!userPermissions) {
      throw new UnauthorizedException("No se encontró el rol o permisos asociados para el usuario.");
    }

    console.log(`userPermissions: ${userPermissions.name}`);

    // Ensure userPermissions.permissions is not null/undefined before mapping
    const permissionsStrings = userPermissions.permissions
      ? userPermissions.permissions.map((p) => p.name)
      : []; // Provide an empty array if permissions is null/undefined

    const hasAllPermissions = requiredPermissions.every((perm) =>
      permissionsStrings.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new UnauthorizedException("No tiene permisos suficientes");
    }

    // Return the full userFound object, which now has its rol property loaded
    return userFound;
  }
}