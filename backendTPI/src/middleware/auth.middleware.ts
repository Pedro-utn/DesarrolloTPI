import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

//Decorador @Permissions unificado con mode: 'any' | 'all'
export const Permissions = (
  permissions: string[],
  mode: 'any' | 'all' = 'all',
) =>
  applyDecorators(
    SetMetadata('permissions', permissions),
    SetMetadata('permissionsMode', mode),
  );

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
    request['accessToken'] = token; //guardamos el token para usarlo luego


    // ✅ Lectura defensiva de metadata
    const permissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];

    const mode =
      this.reflector.get<'any' | 'all'>(
        'permissionsMode',
        context.getHandler(),
      ) || 'all';

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
      console.log('🔒 Modo de validación:', mode.toUpperCase());

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requiredPermissions: permissions,
          mode,
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
