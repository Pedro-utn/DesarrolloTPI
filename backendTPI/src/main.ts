import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Permite solicitudes desde tu frontend Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite los métodos HTTP necesarios
    credentials: true, // Permite el envío de cookies, headers de autorización, etc.
  });
  await app.listen(process.env.PORT ?? 3000);
    // En main.ts o al inicio de tu aplicación
  console.log('🚀 Variables de entorno al iniciar:');
  console.log('   - JWT_SERVICE_URL:', process.env.JWT_SERVICE_URL);
  console.log('   - NODE_ENV:', process.env.NODE_ENV);
}
bootstrap();
