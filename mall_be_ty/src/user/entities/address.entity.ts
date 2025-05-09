import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    addressLineOne:string

    @Column({nullable:true})
    addressLineTwo:string

    @Column()
    zip:string

    @Column({nullable:true})
    landmark:string

    @ManyToOne(()=> User, (user)=> user.address)
    @JoinColumn({ name: 'user' })
    user: User
}
