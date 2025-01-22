import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { StoreReview } from "./storeReview.entity";
import { StoreImage } from "./storeImage.entity";
import { Follow } from "./follow.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "store"})
export class Store {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name:string

    @Column({ unique: true })
    url:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    
    @ManyToOne(() => User, (user) => user.stores)
    @JoinColumn({ name: 'addedBy' })
    user: User;

    @OneToMany(() => Product, (product) => product.store)
    products: Product[];

    @OneToMany(() => Follow, (follow) => follow.store)
    follows: Follow[];

    @OneToOne(()=> StoreReview, (storeReview)=> storeReview.store, {cascade: true})
    @JoinColumn()
    storeReview: StoreReview

    @OneToOne(() => StoreImage, (storeImage) => storeImage.store, {cascade: true})
    @JoinColumn()
    storeImage: StoreImage;
}
