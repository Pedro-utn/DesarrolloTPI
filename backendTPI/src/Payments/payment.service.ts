import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment';
import { TransactionDetail } from './transaction_detail';
import { RefundDetail } from './refund_detail';


export type CreatePaymentDto = {
  orderId: number;
  amount: number;
  method: string;
  transactionDetails: {
    transactionId: string;
    paymentStatus: string;
  };
};

export type UpdatePaymentStatusDto = {
  status: string;
};

export type RefundPaymentDto = {
  reason: string;
};

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(TransactionDetail)
    private transactionRepo: Repository<TransactionDetail>,
    @InjectRepository(RefundDetail)
    private refundRepo: Repository<RefundDetail>
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {

    if (dto.transactionDetails.paymentStatus !== "completed") {
          throw new BadRequestException('Invalid trasacciontionDetail status: only completed is allowed');
    }
    // Crear el detalle de transacción
    const transaction = this.transactionRepo.create({
      transaction_id: dto.transactionDetails.transactionId,
      payment_status: dto.transactionDetails.paymentStatus,
      payment_method: dto.method,
      payment_time: new Date()
    });
    
    const savedTransaction = await this.transactionRepo.save(transaction);

    // Crear el pago
    const payment = this.paymentRepo.create({
      order: { id: dto.orderId } as any,
      amount: dto.amount,
      method: dto.method,
      status: 'paid',
      transactionDetail: savedTransaction
    });
    
    return this.paymentRepo.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({
      relations: ['order', 'transactionDetail', 'refundDetail']
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ 
      where: { id },
      relations: ['order', 'transactionDetail', 'refundDetail']
    });
    
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    
    return payment;
  }

  async updateStatus(id: number, dto: UpdatePaymentStatusDto): Promise<Payment> {

    if (dto.status !== 'completed') {
    throw new BadRequestException('Invalid status: only completed is allowed');
  }
    const payment = await this.findOne(id);
    payment.status = dto.status;
    return this.paymentRepo.save(payment);
  }

  async refund(id: number, dto: RefundPaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status === 'refunded') {
      throw new Error('Este pago ya ha sido reembolsado');
    }

    if (!payment.transactionDetail) {
      throw new Error('No se encontraron detalles de transacción para este pago');
    }

    // Crear reembolso
    const refund = this.refundRepo.create({
      refund_id: `txn_refund_${Math.random().toString(36).substring(2, 10)}`,
      transaction_id: payment.transactionDetail.transaction_id,
      refund_status: 'completed',
      reason: dto.reason,
      refund_time: new Date()
    });
    
    const savedRefund = await this.refundRepo.save(refund);

    // Actualizar pago
    payment.status = 'refunded';
    payment.refundDetail = savedRefund;
    return this.paymentRepo.save(payment);
  }

  async remove(id: number): Promise<{ message: string }> {
    const payment = await this.findOne(id);

    // 1. Primero eliminás el Payment (que tiene FKs a transaction y refund)
    await this.paymentRepo.remove(payment);

    // 2. Luego eliminás el Refund (si existe)
    if (payment.refundDetail) {
      await this.refundRepo.remove(payment.refundDetail);
    }

    // 3. Finalmente eliminás el TransactionDetail (si existe)
    if (payment.transactionDetail) {
      await this.transactionRepo.remove(payment.transactionDetail);
    }

    return { message: 'deleted' };
  }

}