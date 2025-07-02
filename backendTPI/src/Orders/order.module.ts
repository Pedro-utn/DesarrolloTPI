import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthHelper } from '../middleware/auth.helper'; // ajustá ruta

import { Order } from './order';

import { Location } from './order';


@Module({
  imports: [TypeOrmModule.forFeature([Order, Location])],
  controllers: [OrderController],
  providers: [OrderService,AuthHelper],
  exports: [OrderService],
})
export class OrderModule {}