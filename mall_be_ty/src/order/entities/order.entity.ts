import { Deleted } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Status {
    PENDING = 'PENDING',
    SHIPPING = 'SHIPPING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED'
}

@Entity({name: "order"})
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column('float')
    price: number;

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
}
