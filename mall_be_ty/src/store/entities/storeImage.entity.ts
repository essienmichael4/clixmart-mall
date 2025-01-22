import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Store } from "./store.entity";
// import { User } from "./user.entity";

@Entity({name: "storeImage"})
export class StoreImage {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(()=> Store, (store)=> store.storeImage)
    store: Store
}
