import { Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * Servicio auxiliar para llamadas al microservicio JWT (como /me).
 */
@Injectable()
export class AuthHelper {
  /**
   * 🔍 Obtiene la información del usuario a través del endpoint /me del servicio JWT.
   */
  async getMe(token: string): Promise<{
    id: number;
    email: string;
    permissions: string[];
  }> {
    const baseUrl = process.env.JWT_SERVICE_URL || 'http://jwt:3001';
    const url = `${baseUrl}/me`;

    console.log('📡 Realizando request GET a:', url);
    console.log('🔑 Token:', token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error en getMe:', error);
      throw new UnauthorizedException(error.message || 'No autorizado');
    }

    const user = await response.json();
    console.log('✅ Usuario obtenido con getMe:', user);
    return user;
  }
}
