import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProfileImage } from "./profileImage.entity";
import { Store } from "src/store/entities/store.entity";
import { Product } from "src/product/entities/product.entity";
import { ProductReview } from "src/product/entities/review.entity";
import { Follow } from "src/store/entities/follow.entity";

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

    @Column()
    name:string

    @Column({
        unique: true
    })
    email:string

    @Column({
        nullable:true
    })
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

    @OneToOne(()=> ProfileImage, (profileImage)=> profileImage.user, {cascade: true})
    @JoinColumn()
    profileImage: ProfileImage

    @OneToMany(() => Store, (storeEntity) => storeEntity.user)
    stores: Store[];

    @OneToMany(() => Product, (productEntity) => productEntity.user)
    products: Product[];

    @OneToMany(() => ProductReview, (productReviewEntity) => productReviewEntity.user)
    productReviews: ProductReview[];

    @OneToMany(() => Follow, (follow) => follow.user)
    following: Follow[];
}
