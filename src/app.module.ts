import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './Orders/order.module'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({ // KEY DE CONEXION
      type: 'postgres',
      host: 'localhost', 
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'ordenycompra',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrderModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
