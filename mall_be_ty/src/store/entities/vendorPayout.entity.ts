import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Store } from './store.entity';
import { StoreAccount } from './storeAccount.entity';

export enum PayoutStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

@Entity()
export class VendorPayout {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    paidBy: User;

    @ManyToOne(() => Store, (store) => store.payouts, { eager: true })
    store: Store;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    commissionRate: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    netAmount: number;

    @Column({ default: PayoutStatus.PENDING })
    status: PayoutStatus;

    @Column({ default: "Weekly Payout"})
    reference: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;

    @ManyToOne(() => StoreAccount, { eager: true, nullable: true })
    account: StoreAccount;
}
