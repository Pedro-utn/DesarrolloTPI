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
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order';
import { AuthGuard, Permissions } from '../middleware/auth.middleware';

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
  @Permissions(['findAllOrder', 'findMyOrders'], 'any') 
  async findAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('quantity') quantity?: number
  ){
    const user = req.user;

    if (user.permissions.includes('findAllOrder')) {
      return this.orderService.findAll(page, quantity); 
    } else if (user.permissions.includes('findMyOrders')) {
      return this.orderService.findByUserId(req.accessToken, page, quantity);
    } else {
      throw new UnauthorizedException('No tiene permisos para ver órdenes');
    }
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