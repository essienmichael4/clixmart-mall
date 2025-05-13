import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity({name: "storeAddress"})
export class StoreAddress {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    storeAddressId: string

    @Column()
    country:string

    @Column({nullable:true})
    state:string

    @Column({nullable:true})
    city:string

    @Column()
    addressLine:string

    @Column()
    fullname:string

    @Column()
    phone:string

    @Column()
    zip:string

    @Column({nullable:true})
    landmark:string

    @OneToOne(()=> Store, (store)=> store.storeAddress)
    store: Store
}
