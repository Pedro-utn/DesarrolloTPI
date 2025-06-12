import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

class RefundDetails {
  @Column({ nullable: true })
  refundTransactionId: string;

  @Column({ nullable: true })
  refundStatus: string;
}


class TransactionDetails {
  @Column()
  transactionId: string;

  @Column()
  paymentId: string;

  @Column()
  paymentStatus: string; // ← corregido nombre
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column('float')
  amount: number;

  @Column()
  method: string;

  @Column(() => TransactionDetails, { prefix: 'transaction' })
  transactionDetails: TransactionDetails;

  @Column()
  paymentMethod: string;

  @Column({ type: 'timestamp' })
  paymentTime: Date;

  @Column({ default: 'paid' })
  status: string;
  
  @Column(() => RefundDetails, { prefix: 'refund' })
  refundDetails?: RefundDetails;
  

  @Column({ type: 'timestamp', nullable: true })
  refundTime?: Date;
}
