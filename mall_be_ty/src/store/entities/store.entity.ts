import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { StoreReview } from "./storeReview.entity";
import { StoreImage } from "./storeImage.entity";
import { Follow } from "./follow.entity";
import { StoreAddress } from "./storeAddress.entity";
import { StoreDetail } from "./storeDetails.entity";
import { PaymentDetail } from "./paymentDetails.entity";
import { NextOfKin } from "./nextOfKin.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "store"})
export class Store {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    storeId: string

    @Column({ unique: true })
    name:string
    
    @Column({nullable: true})
    searchName:string

    @Column({ unique: true })
    slug:string

    @Column({ unique: true })
    url:string

    @Column({ nullable: true })
    imageName:string

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

    // @OneToOne(() => StoreImage, (storeImage) => storeImage.store, {cascade: true})
    // @JoinColumn()
    // storeImage: StoreImage;

    @OneToOne(() => StoreAddress, (storeAddress) => storeAddress.store, {cascade: true})
    @JoinColumn()
    storeAddress: StoreAddress;

    @OneToOne(() => StoreDetail, (storeDetail) => storeDetail.store, {cascade: true})
    @JoinColumn()
    storeDetail: StoreDetail;

    @OneToOne(() => PaymentDetail, (paymentDetail) => paymentDetail.store, {cascade: true})
    @JoinColumn()
    paymentDetail: PaymentDetail;

    @OneToOne(() => NextOfKin, (nextOfKin) => nextOfKin.store, {cascade: true})
    @JoinColumn()
    nextOfKin: NextOfKin;
}
