import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: "address"})
export class Address {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    addressId: string

    @Column()
    country:string

    @Column({nullable:true})
    state:string

    @Column({nullable:true})
    city:string

    @Column()
    addressLine:string

    @Column()
    zip:string

    @Column({nullable:true})
    landmark:string

    @OneToOne(()=> User, (user)=> user.address)
    user: User
}
