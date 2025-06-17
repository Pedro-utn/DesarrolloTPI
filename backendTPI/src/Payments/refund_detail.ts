import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Payment } from './payment';
import { TransactionDetail } from './transaction_detail';

@Entity('refund_detail')
export class RefundDetail {

  @PrimaryColumn({ name: 'refund_id' })
  refund_id: string; 

  @Column({ name: 'transaction_id', unique: true })
  transaction_id: string; 

  @Column({ name: 'refund_status' })
  refund_status: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ type: 'timestamp', name: 'refund_time' })
  refund_time: Date;

  // Relación OneToOne con TransactionDetail
  @OneToOne(() => TransactionDetail, (transactionDetail) => transactionDetail.refundDetail)
  @JoinColumn({ name: 'transaction_id', referencedColumnName: 'transaction_id' })
  transactionDetail: TransactionDetail;

  // Relación OneToOne con Payment (inversa)
  @OneToOne(() => Payment, (payment) => payment.refundDetail)
  payment: Payment;
}