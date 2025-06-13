import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Put, 
  Delete, 
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { 
  PaymentsService, 
  CreatePaymentDto, 
  UpdatePaymentStatusDto, 
  RefundPaymentDto 
} from './payment.service';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
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
  async findAll(): Promise<any[]> {
    const payments = await this.paymentsService.findAll();
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
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.paymentsService.remove(id);
  }
}