import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity({name: "next_of_kin"})
export class NextOfKin {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    nextOfKinId: string

    @Column()
    name:string

    @Column()
    phone:string

    @OneToOne(()=> Store, (store)=> store.nextOfKin)
    store: Store
}
