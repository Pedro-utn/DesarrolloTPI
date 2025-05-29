import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment';

export interface CreatePaymentDto {
  orderId: number;
  amount: number;
  method: string;
  transactionDetails: {
    transactionId: string;
    paymentStatus: string;
  };
}

export interface UpdatePaymentStatusDto {
  status: string;
}

export interface RefundPaymentDto {
  reason: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      orderId: createPaymentDto.orderId,
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      paymentMethod: createPaymentDto.method,
      transactionDetails: createPaymentDto.transactionDetails,
      status: createPaymentDto.transactionDetails.paymentStatus === 'completed' ? 'paid' : 'pending',
    });
    
    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async updateStatus(id: number, updateStatusDto: UpdatePaymentStatusDto): Promise<Payment> {
    const payment = await this.findOne(id);
    payment.status = updateStatusDto.status;
    return this.paymentRepository.save(payment);
  }

  async refund(id: number, refundDto: RefundPaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    
    if (payment.status === 'refunded') {
      throw new Error('Payment has already been refunded');
    }

    // Generar ID de transacción de reembolso
    const refundTransactionId = `txn_refund_${payment.transactionDetails.transactionId.replace('txn_', '')}`;
    
    payment.status = 'refunded';
    payment.refundDetails = {
      refundTransactionId,
      refundStatus: 'completed'
    };
    payment.refundTime = new Date();

    return this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<{ message: string }> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
    return { message: 'deleted' };
  }
}