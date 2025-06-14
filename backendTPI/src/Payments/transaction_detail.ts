// transaction_detail.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Payment } from './payment';
import { RefundDetail } from './refund_detail';

@Entity('transaction_detail')
export class TransactionDetail {
  @PrimaryColumn({ name: 'transaction_id' })
  transaction_id: string; 

  @Column({ name: 'payment_id', nullable: true })
  payment_id?: string;

  @Column({ name: 'payment_status' })
  payment_status: string;

  @Column({ name: 'payment_method' })
  payment_method: string;

  @Column({ type: 'timestamp', name: 'payment_time' })
  payment_time: Date;

  // Relación OneToOne con Payment (inversa)
  @OneToOne(() => Payment, (payment) => payment.transactionDetail)
  payment: Payment;

  // Relación OneToOne con RefundDetail
  @OneToOne(() => RefundDetail, (refundDetail) => refundDetail.transactionDetail)
  refundDetail?: RefundDetail;
}
