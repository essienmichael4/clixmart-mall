import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity";

@Entity({name: "nextOfKin"})
export class NextOfKin {
    @PrimaryGeneratedColumn()
    id: number

    // @Column({type: "uuid", unique:true})
    // nextOfKinId: string

    @Column()
    name:string

    @Column()
    phone:string

    @OneToOne(()=> Store, (store)=> store.nextOfKin)
    store: Store
}
