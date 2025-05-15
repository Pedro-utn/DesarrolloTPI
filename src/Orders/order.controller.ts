import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Patch, 
  Delete 
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() orderData: any): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateData: any
  ): Promise<Order> {
    return this.orderService.update(+id, updateData);
  }

  @Patch(':id')
  updatePartial(
    @Param('id') id: string, 
    @Body() updateData: any
  ): Promise<Order> {
    return this.orderService.updatePartial(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.orderService.remove(+id);
  }
}