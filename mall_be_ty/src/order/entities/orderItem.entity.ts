import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/product/entities/product.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum Status {
    PENDING = 'PENDING',
    SHIPPING = 'SHIPPING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

@Entity({name: "orderItem"})
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    orderItemId: string

    @Column()
    name:string

    @Column({type: "decimal", precision: 10, scale: 2})
    price: number;

    @Column({type: "decimal", precision: 10, scale: 2})
    subTotal: number;

    @Column()
    quantity: number;

    @Column({ default: Status.PENDING })
    status: Status;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @ManyToOne(() => Order, (order) => order.orderItems, {onDelete: "CASCADE"})
    @JoinColumn({ name: 'order' })
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderItems, {eager: true})
    // @JoinColumn({ name: 'prodcut' })
    product: Product;
}
