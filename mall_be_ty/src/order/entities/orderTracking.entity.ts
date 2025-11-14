import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";

export enum TrackingStatus {
    PENDING = 'PENDING',
    SHIPPING = 'SHIPPING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED'
}

@Entity({name: "tracking"})
export class Tracking {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    trackingId: string
    
    @Column({ type: 'enum', enum: TrackingStatus, default: TrackingStatus.PENDING })
    status: TrackingStatus;

    @Column({ nullable: true })
    courierName: string;

    @Column({ nullable: true })
    trackingNumber: string;

    @Column({ nullable: true })
    estimatedDelivery: Date;

    @Column({ type: 'timestamp', nullable: true })
    shippedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    failedAt: Date;

    @OneToOne(() => Order, (order) => order.tracking, { onDelete: 'CASCADE' })
    @JoinColumn()
    order: Order;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
