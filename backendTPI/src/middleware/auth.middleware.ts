import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios from 'axios';
import { Request } from 'express';

// Decorador @Permissions
export const Permissions = (permissions: string[]) =>
  SetMetadata('permissions', permissions);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    try {
      const response = await axios.post(
        'http://localhost:3001/auth/validate-permissions',
        {
          requiredPermissions: permissions,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      request['user'] = response.data.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        error.response?.data?.message || 'No autorizado',
      );
    }
  }
}
