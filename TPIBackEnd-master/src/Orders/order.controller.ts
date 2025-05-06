import { Controller, Post, Body, Get, Param , NotFoundException} from '@nestjs/common';
import { OrdersService } from './order.service';
import { Order } from './order';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() order: Partial<Order>): Promise<Order> {
    return this.ordersService.create(order);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }


  
}
