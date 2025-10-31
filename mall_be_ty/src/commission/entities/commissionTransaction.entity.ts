import { OrderItem } from "src/order/entities/orderItem.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, OneToOne, UpdateDateColumn } from "typeorm";

export enum ProcessedStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

@Entity()
export class CommissionTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => OrderItem, (item) => item.commissionTransaction, {
        onDelete: "CASCADE",
    })
    orderItem: OrderItem;

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    saleAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    commissionRate: number; // e.g. 15% will be converted to 0.15

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    commissionAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    vendorEarning: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({default: ProcessedStatus.PENDING, nullable: true})
    processedStatus: ProcessedStatus

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
}
