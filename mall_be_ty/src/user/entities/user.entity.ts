import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProfileImage } from "./profileImage.entity";
import { Store } from "src/store/entities/store.entity";
import { Product } from "src/product/entities/product.entity";
import { ProductReview } from "src/product/entities/review.entity";
import { Follow } from "src/store/entities/follow.entity";
import { StoreReview } from "src/store/entities/storeReview.entity";
import { Address } from "./address.entity";
import { AuditLog } from "src/commission/entities/AuditLog.entity";
import { Department } from "./department.entity";
import { Hub } from "src/hub/entities/hub.entity";
import { Delivery } from "src/delivery/entities/delivery.entity";
import { Order } from "src/order/entities/order.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    SUPERADMIN = 'SUPERADMIN'
}

@Entity({name: "user"})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    userId: string

    @Column()
    name:string

    @Column({nullable: true})
    searchName:string
    
    @Column({ unique: true })
    email:string

    @Column({ nullable:true })
    phone:string

    @Column()
    password:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @Column({ default: Role.USER })
    role: Role;

    @OneToOne(()=> ProfileImage, (profileImage)=> profileImage.user, {cascade: true, onDelete: "SET NULL"})
    @JoinColumn()
    profileImage: ProfileImage
    
    @OneToMany(()=> Address, (address)=> address.user, {cascade: true})
    addresses: Address[]

    @OneToMany(() => Store, (storeEntity) => storeEntity.user, {cascade: true, onDelete: "SET NULL"})
    stores: Store[];

    @OneToMany(() => Product, (productEntity) => productEntity.user)
    products: Product[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => ProductReview, (productReviewEntity) => productReviewEntity.user)
    productReviews: ProductReview[];

    @OneToMany(() => StoreReview, (storeReviewEntity) => storeReviewEntity.user)
    storeReviews: StoreReview[];

    @OneToMany(() => Follow, (follow) => follow.user)
    following: Follow[];
    
    @OneToMany(() => AuditLog, (logs) => logs.performedBy)
    auditLogs: AuditLog[];

    @ManyToOne(() => Hub, (hub) => hub.users, { nullable: true })
    hub?: Hub;

    @ManyToMany(() => Department, (department) => department.admins, { eager: false })
    @JoinTable()
    departments?: Department[];

     // Deliveries created by this user
    @OneToMany(() => Delivery, (delivery) => delivery.createdBy)
    createdDeliveries: Delivery[];

    // Deliveries assigned to this user
    @OneToMany(() => Delivery, (delivery) => delivery.assignedTo)
    assignedDeliveries: Delivery[];

    @OneToMany(() => Delivery, (d) => d.sender)
    sentDeliveries: Delivery[];

    @OneToMany(() => Delivery, (d) => d.receiver)
    receivedDeliveries: Delivery[];
}
