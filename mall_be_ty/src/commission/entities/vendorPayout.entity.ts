import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CommissionTransaction } from './commissionTransaction.entity';

export enum PayoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PART = 'PART',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

@Entity()
export class VendorPayout {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    vendor: User;

    @OneToMany(() => CommissionTransaction, tx => tx.payout)
    transactions: CommissionTransaction[];

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: PayoutStatus.PENDING })
    status: PayoutStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ nullable: true })
    paidAt: Date;
}
