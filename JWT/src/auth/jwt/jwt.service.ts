import { Injectable, UnauthorizedException } from "@nestjs/common";
import { sign, verify, JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken"; // Importa los tipos de error específicos
import * as dayjs from "dayjs"; // librería para manejar fechas
import { Payload } from "src/modules/interfaces/payload";

// Servicio para manejar la gestión de JSON Web Tokens (JWT)
// Hay métodos para generar tokens, refrescarlos y obtener el payload de un token

@Injectable()
export class JwtService {
  // Configuración de los diferentes tipos de tokens (auth y refresh)
  config = {
    auth: {
      secret: "authSecret", // Clave secreta para firmar y verificar tokens de autenticación
      expiresIn: "15m", // Tiempo de expiración para tokens de autenticación
    },
    refresh: {
      secret: "refreshSecret", // Clave secreta para firmar y verificar refresh tokens
      expiresIn: "1d", // Tiempo de expiración para refresh tokens
    },
  };

  // Genera un nuevo token JWT (auth o refresh)

  generateToken(
    payload: { email: string },
    type: "refresh" | "auth" = "auth",
  ): string {
    return sign(payload, this.config[type].secret, {
      expiresIn: this.config[type].expiresIn,
    });
  }

  // Refresca un token de autenticación utilizando el refresh token
  // Si el refresh token está a punto de expirar, genera uno nuevo

  refreshToken(refreshToken: string): {
    accessToken: string;
    refreshToken: string;
  } {
    try {
      // Intenta obtener el payload del refresh token
      const payload = this.getPayload(refreshToken, "refresh");

      // Calcula el tiempo restante hasta la expiración del refresh token
      const timeToExpire = dayjs.unix(payload.exp).diff(dayjs(), "minute");

      return {
        // Genera un nuevo token de acceso si el refresh token es válido
        accessToken: this.generateToken({ email: payload.email }),
        // Genera un nuevo refresh token si el tiempo restante es menor a 20 minutos
        refreshToken:
          timeToExpire < 20
            ? this.generateToken({ email: payload.email }, "refresh")
            : refreshToken, // Si aún queda tiempo suficiente, devuelve el refresh token original
      };
    } catch (error) {
      // Captura cualquier error durante la verificación del refresh token
      throw new UnauthorizedException("Error al refrescar el token.");
    }
  }

  // Decodifica y verifica un token JWT (auth o refresh)

  getPayload(token: string, type: "refresh" | "auth" = "auth"): Payload {
    // Elimina el prefijo "Bearer" si está presente en el token
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    try {
      // Verifica y decodifica el token usando la clave secreta 
      const decoded = verify(cleanToken, this.config[type].secret) as Payload;
      return decoded;
    } catch (error) {
      // Maneja diferentes tipos de errores de JWT
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("Token de autenticación expirado.");

      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException("Token de autenticación inválido.");

      } else if (error instanceof NotBeforeError) {
        throw new UnauthorizedException("Token de autenticación aún no válido.");

      } else {
        throw new UnauthorizedException("Error en la verificación del token.");
      }
    }
  }
}