import { Injectable, NotFoundException } from '@nestjs/common';
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
    paymentId?: string; // Opcional, para ID interno del sistema de pagos
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
    const { transactionId, paymentStatus, paymentId } = dto.transactionDetails;

    // Crear el detalle de transacción usando los nombres correctos de propiedades
    const transaction = this.transactionRepo.create({
      transaction_id: transactionId,
      payment_id: paymentId || undefined, // Cambiar null por undefined
      payment_status: paymentStatus,
      payment_method: dto.method,
      payment_time: new Date()
    });
    
    const savedTransaction = await this.transactionRepo.save(transaction);

    // Crear el pago - corregir la forma de asignar el order
    const payment = this.paymentRepo.create({
      amount: dto.amount,
      method: dto.method,
      status: 'paid',
      transactionDetail: savedTransaction
    });
    
    // Asignar el order después de crear la instancia
    payment.order = { id: dto.orderId } as any;
    
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

  async findByTransactionId(transactionId: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({
      where: { 
        transactionDetail: { transaction_id: transactionId }
      },
      relations: ['order', 'transactionDetail', 'refundDetail']
    });
  }

  async updateStatus(id: number, dto: UpdatePaymentStatusDto): Promise<Payment> {
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

    // Verificar si ya existe un reembolso para esta transacción
    const existingRefund = await this.refundRepo.findOne({
      where: { transaction_id: payment.transactionDetail.transaction_id }
    });

    if (existingRefund) {
      throw new Error('Ya existe un reembolso para esta transacción');
    }

    // Crear el detalle de reembolso usando los nombres correctos de propiedades
    const refund = this.refundRepo.create({
      refund_id: 'refund_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now(),
      transaction_id: payment.transactionDetail.transaction_id,
      refund_status: 'completed',
      reason: dto.reason,
      refund_time: new Date()
    });
    
    const savedRefund = await this.refundRepo.save(refund);

    // Actualizar el estado del pago
    payment.status = 'refunded';
    payment.refundDetail = savedRefund;
    
    return this.paymentRepo.save(payment);
  }

  async remove(id: number): Promise<{ message: string }> {
    const payment = await this.findOne(id);
    
    // Si tiene un reembolso asociado, eliminarlo primero
    if (payment.refundDetail) {
      await this.refundRepo.remove(payment.refundDetail);
    }
    
    // Eliminar la transacción asociada
    if (payment.transactionDetail) {
      await this.transactionRepo.remove(payment.transactionDetail);
    }
    
    // Finalmente eliminar el pago
    await this.paymentRepo.remove(payment);
    
    return { message: `Pago con ID ${id} eliminado correctamente` };
  }

  // Métodos adicionales útiles

  async findPaymentsByStatus(status: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { status },
      relations: ['order', 'transactionDetail', 'refundDetail']
    });
  }

  async findRefundsByStatus(status: string): Promise<RefundDetail[]> {
    return this.refundRepo.find({
      where: { refund_status: status },
      relations: ['transactionDetail', 'payment']
    });
  }

  async getTransactionDetail(transactionId: string): Promise<TransactionDetail | null> {
    return this.transactionRepo.findOne({
      where: { transaction_id: transactionId },
      relations: ['payment', 'refundDetail']
    });
  }

  async updateRefundStatus(refundId: string, status: string): Promise<RefundDetail> {
    const refund = await this.refundRepo.findOne({
      where: { refund_id: refundId },
      relations: ['payment']
    });

    if (!refund) {
      throw new NotFoundException(`Reembolso con ID ${refundId} no encontrado`);
    }

    refund.refund_status = status;
    const updatedRefund = await this.refundRepo.save(refund);

    // Si el reembolso se completa, actualizar el estado del pago
    if (status === 'completed' && refund.payment) {
      refund.payment.status = 'refunded';
      await this.paymentRepo.save(refund.payment);
    }

    return updatedRefund;
  }
}