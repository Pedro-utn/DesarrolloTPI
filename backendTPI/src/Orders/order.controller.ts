import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  Put, 
  Patch, 
  Delete,
  Query
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/middleware/auth.middleware';

@UseGuards(AuthGuard) 
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @Post()
  @Permissions(['createOrder'])
  create(@Body() orderData: any): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @Get()
  @Permissions(['findAllOrder'])
  findAll(
    @Query('page') page?: string,
    @Query('quantity') quantity?: string,
  ): Promise<Order[]> {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const quantityNum = quantity ? parseInt(quantity, 10) : undefined;
    return this.orderService.findAll(pageNum, quantityNum);
  }

  @Get(':id')
  @Permissions(['findOneOrder'])

  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(+id);
  }

  @Put(':id')
  @Permissions(['putOrder'])
  update(
    @Param('id') id: string, 
    @Body() updateData: any
  ): Promise<Order> {
    return this.orderService.update(+id, updateData);
  }

  @Patch(':id')
  @Permissions(['patchOrder'])
  updatePartial(
    @Param('id') id: string, 
    @Body() updateData: any
  ): Promise<Order> {
    return this.orderService.updatePartial(+id, updateData);
  }

  @Delete(':id')
  @Permissions(['deleteOrder'])
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.orderService.remove(+id);
  }
}