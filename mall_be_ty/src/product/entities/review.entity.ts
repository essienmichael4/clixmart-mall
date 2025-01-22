import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

export enum Status {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

@Entity({name: "productReview"})
export class ProductReview {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: Status.PENDING })
    status: Status;

    @Column({nullable: true, type: "text"})
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'reviewedBy' })
    user: User;

    @OneToOne(()=> Product, (product)=> product.productReview)
    product: Product
}
