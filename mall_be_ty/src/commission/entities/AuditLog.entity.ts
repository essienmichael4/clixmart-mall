import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

export enum AuditAction {
  // Commission
  COMMISSION_PROCESSED = 'COMMISSION_PROCESSED',
  COMMISSION_REVERSED = 'COMMISSION_REVERSED',

  // Revenue
  REVENUE_PROCESSED = 'REVENUE_PROCESSED',
  REVENUE_PROCESS_FAILED = 'REVENUE_PROCESS_FAILED',

  // Revenue Month History
  REVENUE_HISTORY_UPSERTED = 'REVENUE_HISTORY_UPSERTED',
  REVENUE_HISTORY_FAILED = 'REVENUE_HISTORY_FAILED',

  // Store
  STORE_UPDATED = 'STORE_UPDATED',
  STORE_UPDATE_FAILED = 'STORE_UPDATE_FAILED',

  // Payout / Batch Processing
  PAYOUT_INITIATED = 'PAYOUT_INITIATED',
  PAYOUT_COMPLETED = 'PAYOUT_COMPLETED',
  PAYOUT_FAILED = 'PAYOUT_FAILED',
  PAYMENT_EVALUATION_INITIATED = 'PAYMENT_EVALUATION_INITIATED',
  PAYMENT_EVALUATION_COMPLETED = 'PAYMENT_EVALUATION_COMPLETED',
  PAYMENT_EVALUATION_FAILED = 'PAYMENT_EVALUATION_FAILED',

  ACCOUNT_DAILY_AGGREGATED = 'ACCOUNT_DAILY_AGGREGATED',
  ACCOUNT_DAILY_AGGREGATION_FAILED = 'ACCOUNT_DAILY_AGGREGATION_FAILED',
  ACCOUNT_MONTHLY_ROLLED_UP = 'ACCOUNT_MONTHLY_ROLLED_UP',

  // Tax
  CREATE_TAX = 'CREATE_TAX',
  TAX_CREATION_FAILED = 'TAX_CREATION_FAILED',
  UPDATE_TAX = 'UPDATE_TAX',
  TAX_UPDATE_FAILED = 'TAX_UPDATE_FAILED',

  // 👇 for batching
  BATCH_STARTED = 'BATCH_STARTED',
  BATCH_COMPLETED = 'BATCH_COMPLETED'
}

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: AuditAction, enumName: 'audit_action_enum' })
    action: AuditAction;

    @Column({ type: 'json', nullable: true })
    data: any; // Payload of the operation

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    isError: boolean;

    @Column({ nullable: true })
    errorMessage: string;

    @Column({ nullable: true })
    context: string; // e.g., 'PAYOUTS', 'COMMISSIONS'

    @ManyToOne(() => User, { eager: true })
    performedBy: User;
}
