import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

class TransactionDetails {
  @Column()
  transactionId: string;

  @Column()
  paymentStatus: string;
}

class RefundDetails {
  @Column({ nullable: true })
  refundTransactionId?: string;

  @Column({ nullable: true })
  refundStatus?: string;
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  method: string;

  @Column(() => TransactionDetails, { prefix: 'transaction_' })
  transactionDetails: TransactionDetails;

  @Column(() => RefundDetails, { prefix: 'refund_' })
  refundDetails?: RefundDetails;

  @Column()
  paymentMethod: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'completed', 'refunded'],
    default: 'pending'
  })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  paymentTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundTime?: Date;
}