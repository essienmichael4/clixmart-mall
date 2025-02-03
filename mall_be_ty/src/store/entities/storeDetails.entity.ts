import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

export enum Registered {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "storeDetail"})
export class StoreDetail {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: Registered.FALSE })
    isRegistered: Registered;

    @Column()
    nationalId:string

    @OneToOne(()=> Store, (store)=> store.storeDetail)
    store: Store
}