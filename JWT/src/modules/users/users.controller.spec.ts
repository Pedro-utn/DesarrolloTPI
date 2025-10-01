// Mockeamos las dependencias
jest.mock('./users.service', () => {
  return {
    UsersService: jest.fn().mockImplementation(() => ({
      login: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn(),
      updateRol: jest.fn(),
    }))
  };
});

jest.mock('../../auth/middlewares/auth.services', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      validateTokenAndPermissions: jest.fn(),
    }))
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/middlewares/auth.services';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController - Pruebas Estructuradas', () => {
  let controller: UsersController;
  let usersService: UsersService;

  //Metodo que se ejecuta antes de cada test. Asegura un contexto limpio para cada prueba.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, AuthService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  //Metodo que se ejecuta despues de cada test. Limpia la cache relacionada a los mocks.
  afterEach(() => {
    jest.clearAllMocks();
  });

  // PRUEBA 1
  test('PRUEBA 1: debería autenticar usuario con credenciales válidas', async () => {
    let logFinal = '';
    
    // Acumulamos todo en una variable
    logFinal += '===== PRUEBA 1 =====\n';
    logFinal += 'DESCRIPCION: Verificar que un usuario puede autenticarse correctamente con credenciales válidas\n';
    logFinal += 'PRECONDICIONES: Usuario existe en el sistema, credenciales son correctas, servicio de usuarios disponible\n';
    logFinal += 'PASOS DE EJECUCION:\n';
    logFinal += '  1. Preparar datos de login válidos\n';
    logFinal += '  2. Configurar mock del servicio para devolver tokens\n';
    logFinal += '  3. Ejecutar controller.login() con los datos\n';
    logFinal += '  4. Verificar que se llama al servicio correctamente\n';
    logFinal += '  5. Verificar que se devuelven tokens de acceso\n';
    
    // Datos de entrada
    const loginData = { 
      email: "usuario_valido@test.com", 
      password: "password123" 
    };
    logFinal += 'DATOS DE ENTRADA: ' + JSON.stringify(loginData, null, 2) + '\n';
    
    const tokensEsperados = {
      accessToken: "token_acceso_123",
      refreshToken: "token_refresh_456"
    };
    logFinal += 'RESULTADO ESPERADO: Login exitoso con devolución de tokens de acceso y refresh token\n';

    try {
      // Configurar mock
      (usersService.login as jest.Mock).mockResolvedValue(tokensEsperados);

      // Ejecutar
      const resultado = await controller.login(loginData);

      // Verificar resultado
      expect(usersService.login).toHaveBeenCalledTimes(1);
      expect(usersService.login).toHaveBeenCalledWith(loginData);
      expect(resultado.accessToken).toBe("token_acceso_123");
      expect(resultado.refreshToken).toBe("token_refresh_456");

      // Solo se muestra si pasa todas las verificaciones
      logFinal += 'RESULTADO ACTUAL: Login exitoso - tokens devueltos correctamente\n';
      logFinal += '===== FIN PRUEBA 1 =====\n\n';
      
      // Mostramos todo el log al final
      console.log(logFinal);
    } catch (error) {
      logFinal += 'RESULTADO ACTUAL: PRUEBA FALLIDA - ' + error.message + '\n';
      logFinal += '===== FIN PRUEBA 1 =====\n\n';
      
      // Mostramos todo el log al final
      console.log(logFinal);
      throw error;
    }
  });

  // PRUEBA 2
  test('PRUEBA 2: debería rechazar credenciales inválidas', async () => {
    let logFinal = '';
    
    logFinal += '===== PRUEBA 2 =====\n';
    logFinal += 'DESCRIPCION: Verificar que el sistema rechaza credenciales incorrectas\n';
    logFinal += 'PRECONDICIONES: Usuario existe en el sistema, contraseña es incorrecta, servicio lanza excepción\n';
    logFinal += 'PASOS DE EJECUCION:\n';
    logFinal += '  1. Preparar datos con contraseña incorrecta\n';
    logFinal += '  2. Configurar mock para lanzar UnauthorizedException\n';
    logFinal += '  3. Ejecutar controller.login() y capturar error\n';
    logFinal += '  4. Verificar que se lanza excepción correcta\n';
    logFinal += '  5. Verificar que se llamó al servicio con los datos\n';
    
    // Datos de entrada
    const loginData = { 
      email: "usuario_existente@test.com", 
      password: "password_incorrecto" 
    };
    logFinal += 'DATOS DE ENTRADA: ' + JSON.stringify(loginData, null, 2) + '\n';
    logFinal += 'RESULTADO ESPERADO: Se lanza UnauthorizedException y no se devuelven tokens\n';

    try {
      // Configurar mock para que falle
      (usersService.login as jest.Mock).mockRejectedValue(new UnauthorizedException());

      // Verificar que lanza error
      await expect(controller.login(loginData)).rejects.toThrow(UnauthorizedException);
      
      // Verificar que igual se llamó al servicio
      expect(usersService.login).toHaveBeenCalledTimes(1);
      expect(usersService.login).toHaveBeenCalledWith(loginData);

      // Solo se muestra si pasa todas las verificaciones
      logFinal += 'RESULTADO ACTUAL: UnauthorizedException lanzada correctamente - credenciales rechazadas\n';
      logFinal += '===== FIN PRUEBA 2 =====\n\n';
      
      // Mostramos todo el log al final
      console.log(logFinal);
    } catch (error) {
      logFinal += 'RESULTADO ACTUAL: PRUEBA FALLIDA - ' + error.message + '\n';
      logFinal += '===== FIN PRUEBA 2 =====\n\n';
      
      // Mostramos todo el log al final
      console.log(logFinal);
      throw error;
    }
  });

  // PRUEBA 3
  test('PRUEBA 3: debería manejar múltiples usuarios concurrentes', async () => {
    let logFinal = '';
    
    logFinal += '===== PRUEBA 3 =====\n';
    logFinal += 'DESCRIPCION: Verificar que el sistema maneja correctamente múltiples solicitudes de login simultáneas\n';
    logFinal += 'PRECONDICIONES: Existen múltiples usuarios, servicio maneja concurrencia, tokens únicos por usuario\n';
    logFinal += 'PASOS DE EJECUCION:\n';
    logFinal += '  1. Crear 5 usuarios diferentes\n';
    logFinal += '  2. Configurar mock para devolver tokens únicos\n';
    logFinal += '  3. Ejecutar todos los logins en paralelo\n';
    logFinal += '  4. Verificar que todos se procesaron\n';
    logFinal += '  5. Verificar tokens únicos por usuario\n';
    
    // Datos de entrada - 5 usuarios
    const usuarios = [
      { email: "user1@test.com", password: "pass1" },
      { email: "user2@test.com", password: "pass2" },
      { email: "user3@test.com", password: "pass3" },
      { email: "user4@test.com", password: "pass4" },
      { email: "user5@test.com", password: "pass5" }
    ];
    logFinal += 'DATOS DE ENTRADA: ' + JSON.stringify(usuarios, null, 2) + '\n';
    logFinal += 'RESULTADO ESPERADO: 5 logins exitosos con tokens únicos para cada usuario\n';

    try {
      // Configurar mock para devolver tokens únicos
      (usersService.login as jest.Mock).mockImplementation(function(loginData) {
        // Simular procesamiento único por usuario
        return Promise.resolve({
          accessToken: `access_${loginData.email}`,
          refreshToken: `refresh_${loginData.email}`
        });
      });

      // Ejecutar todos los logins en paralelo
      const promesasLogin = [];
      for (let i = 0; i < usuarios.length; i++) {
        promesasLogin.push(controller.login(usuarios[i]));
      }

      const resultados = await Promise.all(promesasLogin);

      // Verificar resultados
      expect(usersService.login).toHaveBeenCalledTimes(5);
      
      // Verificar cada usuario individualmente
      for (let i = 0; i < resultados.length; i++) {
        const usuarioEsperado = usuarios[i];
        const resultado = resultados[i];
        
        expect(resultado.accessToken).toBe(`access_${usuarioEsperado.email}`);
        expect(resultado.refreshToken).toBe(`refresh_${usuarioEsperado.email}`);
      }

      // Solo se muestra si pasa todas las verificaciones
      logFinal += 'RESULTADO ACTUAL: 5 logins procesados correctamente - tokens únicos generados para cada usuario\n';
      logFinal += '===== FIN PRUEBA 3 =====\n\n';
      
      // Mostramos todo el log al final
      console.log(logFinal);
    } catch (error) {
      logFinal += 'RESULTADO ACTUAL: PRUEBA FALLIDA - ' + error.message + '\n';
      logFinal += '===== FIN PRUEBA 3 =====\n\n';
      
      // Mostramos todo el log al final
      console.log(logFinal);
      throw error;
    }
  });
});