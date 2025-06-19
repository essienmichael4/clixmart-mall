import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity({name: "storeAccount"})
export class StoreAccount {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    storeAccountId: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    currentAccont: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    due:number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unpaid:number

    @OneToOne(()=> Store, (store)=> store.storeAccount)
    store: Store
}
