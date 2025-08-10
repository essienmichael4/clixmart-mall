import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

export enum AuditAction {
  COMMISSION_PROCESSED = 'COMMISSION_PROCESSED',
  COMMISSION_REVERSED = 'COMMISSION_REVERSED',
  PAYOUT_INITIATED = 'PAYOUT_INITIATED',
  CREATE_TAX = 'CREATE_TAX',
  TAX_CREATION_FAILED = 'TAX_CREATION_FAILED',
  UPDATE_TAX = 'UPDATE_TAX',
  TAX_UPDATE_FAILED = 'TAX_UPDATE_FAILED'
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
