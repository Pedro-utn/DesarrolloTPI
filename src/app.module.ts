import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './Orders/order.module'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({ // KEY DE CONEXION
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'tu_usuario',
      password: 'tu_password',
      database: 'tu_base',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    OrdersModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
