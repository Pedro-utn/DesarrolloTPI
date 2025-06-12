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
import { Payment } from './payment';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdatePaymentStatusDto
  ): Promise<Payment> {
    return this.paymentsService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/refund')
  async refund(
    @Param('id', ParseIntPipe) id: number,
    @Body() refundDto: RefundPaymentDto
  ): Promise<Payment> {
    return this.paymentsService.refund(id, refundDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.paymentsService.remove(id);
  }
}