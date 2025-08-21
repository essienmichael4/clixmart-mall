import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Store } from './store.entity';

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

    @ManyToOne(() => Store, (store) => store.payments, { eager: true })
    store: Store;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: PayoutStatus.PENDING })
    status: PayoutStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;
}
