import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

export enum ReviewStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

@Entity({name: "productReview"})
export class ProductReview {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: ReviewStatus.PENDING })
    status: ReviewStatus;

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
