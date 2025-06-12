import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './Orders/order.module';

import { PaymentsModule } from './Payments/payment.module'; // 👈 Ruta correcta

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'ordenycompra',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrderModule,
    PaymentsModule, // 👈 Agregar esta línea
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}