import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { StoreReview } from "./storeReview.entity";
import { Follow } from "./follow.entity";
import { StoreAddress } from "./storeAddress.entity";
import { StoreDetail } from "./storeDetails.entity";
import { PaymentDetail } from "./paymentDetails.entity";
import { NextOfKin } from "./nextOfKin.entity";
import { StoreAccount } from "./storeAccount.entity";
import { VendorPayout } from "./vendorPayout.entity";
import { Account } from "src/commission/entities/commissionAccount.entity";

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

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    processedRevenue: number;

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

    @OneToMany(() => Product, (product) => product.store, { cascade: true, onDelete: 'CASCADE' })
    products: Product[];

    @OneToMany(() => Follow, (follow) => follow.store, { cascade: true, onDelete: 'CASCADE' })
    follows: Follow[];

    @OneToOne(()=> StoreReview, (storeReview)=> storeReview.store, {cascade: true})
    @JoinColumn()
    storeReview: StoreReview

    @OneToOne(() => StoreAddress, (storeAddress) => storeAddress.store, {cascade: true})
    @JoinColumn()
    storeAddress: StoreAddress;

    @OneToOne(() => StoreDetail, (storeDetail) => storeDetail.store, {cascade: true})
    @JoinColumn()
    storeDetail: StoreDetail;

    @OneToOne(() => PaymentDetail, (paymentDetail) => paymentDetail.store, {cascade: true})
    @JoinColumn()
    paymentDetail: PaymentDetail;

    @OneToOne(() => StoreAccount, (account) => account.store, {cascade: true})
    @JoinColumn()
    storeAccount: StoreAccount;

    @OneToOne(() => NextOfKin, (nextOfKin) => nextOfKin.store, {cascade: true})
    @JoinColumn()
    nextOfKin: NextOfKin;

    @OneToMany(() => VendorPayout, (payment) => payment.store)
    payouts: VendorPayout[];

    // @OneToOne(() => Account, (account) => account.store, { cascade: true })
    // @JoinColumn()
    // financialAccount: Account;
}
