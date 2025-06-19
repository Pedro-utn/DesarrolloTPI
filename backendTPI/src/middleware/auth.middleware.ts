import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
      // 🚀 DEBUG
      console.log('🔍 DEBUG - Variables de entorno JWT:');
      console.log('   - JWT_SERVICE_URL:', process.env.JWT_SERVICE_URL);
      console.log('   - NODE_ENV:', process.env.NODE_ENV);

      const baseUrl = process.env.JWT_SERVICE_URL || 'http://jwt:3001';
      const fullUrl = `${baseUrl}/auth/validate-permissions`;
      console.log('🟢 Usando FETCH para validar permisos en:', fullUrl);

      console.log('🔒 Enviando token al servicio JWT:', token);
      console.log('🔒 Permisos requeridos:', permissions);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          requiredPermissions: permissions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error response del servicio JWT:', errorData);
        throw new UnauthorizedException(
          errorData.message || 'No autorizado',
        );
      }

      const data = await response.json();
      console.log('✅ Respuesta del servicio JWT:', data);

      request['user'] = data;
      return true;

    } catch (error) {
      console.error('❌ Excepción inesperada en AuthGuard:', error);
      throw new UnauthorizedException('No autorizado');
    }
  }
}
