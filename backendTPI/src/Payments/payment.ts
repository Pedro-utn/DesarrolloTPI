// payment.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../Orders/order';
import { TransactionDetail } from './transaction_detail';
import { RefundDetail } from './refund_detail';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column('float')
  amount: number;

  @Column()
  method: string;

  // Relación OneToOne con TransactionDetail
  @OneToOne(() => TransactionDetail, (transactionDetail) => transactionDetail.payment, { eager: true })
  @JoinColumn({ name: 'transaction_detail_id', referencedColumnName: 'transaction_id' })
  transactionDetail: TransactionDetail;

  @Column({ default: 'pending' })
  status: string;

  // Relación OneToOne con RefundDetail
  @OneToOne(() => RefundDetail, (refundDetail) => refundDetail.payment, { nullable: true, eager: true })
  @JoinColumn({ name: 'refund_detail_id', referencedColumnName: 'refund_id' })
  refundDetail?: RefundDetail;
}