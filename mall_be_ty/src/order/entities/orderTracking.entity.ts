import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @Column({ default: TrackingStatus.PENDING })
    status: TrackingStatus;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(()=> Order, (order)=> order.tracking)
    order: Order
}
