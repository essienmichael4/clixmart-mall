import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

export enum Mode {
    MOMO = 'MOMO',
    BANK = 'BANK',
}

@Entity({name: "paymentDetail"})
export class PaymentDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: Mode.MOMO })
    paymentMode: Mode;

    @Column()
    accountName:string

    @Column()
    accountNumber:string

    @Column()
    provider:string

    @OneToOne(()=> Store, (store)=> store.paymentDetail)
    store: Store
}