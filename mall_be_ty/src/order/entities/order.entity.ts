import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./orderItem.entity";
import { Address } from "src/user/entities/address.entity";
import { Tracking } from "./orderTracking.entity";
import { Shipment } from "src/delivery/entities/shipment.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    SHIPPING = 'SHIPPING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    CANCELLED = 'CANCELLED'
}

@Entity({name: "order"})
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    orderId: string

    @Column({nullable: true})
    shownOrderId: string

    @Column({ default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({type: "decimal", precision: 10, scale: 2})
    total: number;
    
    @Column({type: "decimal", precision: 10, scale: 2, default: 0.00})
    tax: number;
    
    @Column({type: "decimal", precision: 10, scale: 2, default: 0.00})
    discount: number;
    
    @Column({type: "decimal", precision: 10, scale: 2, default: 0.00})
    shippingFee: number;

    @Column({type: "text", nullable:true, default: "Payment on delivery"})
    paymentMethod: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @Column({ nullable:true})
    isPaid: PaymentStatus;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {cascade: true})
    orderItems: OrderItem[];

    @ManyToOne(() => User, (user) => user.orders, { eager: true })
    @JoinColumn({ name: 'orderedBy' })
    user: User;

    @ManyToOne(() => Address, address => address.orders, { eager: true })
    address: Address;

    @OneToOne(()=> Tracking, (tracking)=> tracking.order)
    tracking: Tracking

    @ManyToMany(() => Shipment, shipment => shipment.orders)
    shipments: Shipment[];
}
