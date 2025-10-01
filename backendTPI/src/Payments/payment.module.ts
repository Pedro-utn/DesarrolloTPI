import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment';
import { PaymentsController } from './payment.controller';
import { PaymentsService } from './payment.service';
import { TransactionDetail } from './transaction_detail';
import { RefundDetail } from './refund_detail';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, TransactionDetail, RefundDetail])
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
