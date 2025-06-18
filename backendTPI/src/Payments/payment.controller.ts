import { 
  Controller, 
  Post, 
  UseGuards,
  Body,   
  Get, 
  Param, 
  Put, 
  Delete, 
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query
} from '@nestjs/common';
import { 
  PaymentsService, 
  CreatePaymentDto, 
  UpdatePaymentStatusDto, 
  RefundPaymentDto 
} from './payment.service';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/middleware/auth.middleware';


@UseGuards(AuthGuard) 
@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Permissions(['createPayment'])  
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<any> {
    const payment = await this.paymentsService.create(createPaymentDto);
    return {
      id: payment.id,
      orderId: payment.order.id,
      status: payment.status,
      transactionDetails: {
        transactionId: payment.transactionDetail.transaction_id,
        paymentStatus: payment.transactionDetail.payment_status
      },
      paymentMethod: payment.method,
      paymentTime: payment.transactionDetail.payment_time
    };
  }

  @Get()
  @Permissions(['findAllPayment'])
  async findAll(
    @Query('page') page?: string,
    @Query('quantity') quantity?: string,
  ): Promise<any[]> {
    const pageNum = page ? parseInt(page, 10): undefined;
    const quantityNum = quantity ? parseInt(quantity, 10): undefined;
    
    const payments = await this.paymentsService.findAll(pageNum, quantityNum);
    
    return payments.map(payment => ({
      id: payment.id,
      orderId: payment.order.id,
      status: payment.status,
      transactionDetails: {
        transactionId: payment.transactionDetail?.transaction_id,
        paymentStatus: payment.transactionDetail?.payment_status
      },
      paymentMethod: payment.method,
      paymentTime: payment.transactionDetail?.payment_time
    }));
  }


  @Get(':id')
  @Permissions(['findOnePayment'])
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const payment = await this.paymentsService.findOne(id);
    return {
      id: payment.id,
      orderId: payment.order.id,
      status: payment.status,
      transactionDetails: {
        transactionId: payment.transactionDetail?.transaction_id,
        paymentStatus: payment.transactionDetail?.payment_status
      },
      paymentMethod: payment.method,
      paymentTime: payment.transactionDetail?.payment_time
    };
  }

  @Put(':id/status')
  @Permissions(['updateStatusPayment'])
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdatePaymentStatusDto
  ): Promise<any> {
    const payment = await this.paymentsService.updateStatus(id, updateStatusDto);
    return {
      id: payment.id,
      orderId: payment.order.id,
      status: payment.status,
      transactionDetails: {
        transactionId: payment.transactionDetail?.transaction_id,
        paymentStatus: payment.transactionDetail?.payment_status
      },
      paymentMethod: payment.method,
      paymentTime: payment.transactionDetail?.payment_time
    };
  }

  @Post(':id/refund')
  @Permissions(['postRefundPayment'])
  async refund(
    @Param('id', ParseIntPipe) id: number,
    @Body() refundDto: RefundPaymentDto
  ): Promise<any> {
    const payment = await this.paymentsService.refund(id, refundDto);
    return {
      id: payment.id,
      orderId: payment.order.id,
      status: payment.status,
      refundDetails: {
        refundTransactionId: payment.refundDetail?.refund_id,
        refundStatus: payment.refundDetail?.refund_status
      },
      paymentMethod: payment.method,
      refundTime: payment.refundDetail?.refund_time
    };
  }

  @Delete(':id')
  @Permissions(['deletePayment'])
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.paymentsService.remove(id);
  }
}