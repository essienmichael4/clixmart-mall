import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

export enum Registered {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "store_detail"})
export class StoreDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    storeDetailId: string

    @Column({ default: Registered.FALSE })
    isRegistered: Registered;

    @Column()
    nationalId:string

    @OneToOne(()=> Store, (store)=> store.storeDetail)
    store: Store
}
