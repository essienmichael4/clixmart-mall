import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Store } from "./store.entity";
// import { Product } from "./product.entity";

export enum Status {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

@Entity({name: "store_review"})
export class StoreReview {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    storeReviewId: string

    @Column({ default: Status.PENDING })
    status: Status;

    @Column({nullable: true, type: "text"})
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.storeReviews)
    @JoinColumn({ name: 'reviewedBy' })
    user: User;

    @OneToOne(()=> Store, (store)=> store.storeReview)
    store: Store
}
