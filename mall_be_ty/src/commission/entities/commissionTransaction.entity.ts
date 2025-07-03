import { OrderItem } from "src/order/entities/orderItem.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { VendorPayout } from "./vendorPayout.entity";

@Entity()
export class CommissionTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => OrderItem, (item)=> item.commissionTransaction)
    orderItem: OrderItem;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    saleAmount: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    commissionRate: number; // e.g. 15% will be converted to 0.15

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    commissionAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    vendorEarning: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: false })
    isPaid: boolean;

    @Column({ default: false })
    isReversed: boolean;

    @Column({ nullable: true })
    reversalReason: string;

    @Column({ nullable: true })
    reversedAt: Date;

    @Column({ nullable: true })
    reversalReferenceId: number;

    @ManyToOne(() => User)
    vendor: User;

    @ManyToOne(() => VendorPayout, payout => payout.transactions, { nullable: true })
    payout: VendorPayout;
}
