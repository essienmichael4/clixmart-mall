import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Order } from "src/order/entities/order.entity";

export enum AddressType {
    HOME = 'HOME',
    OFFICE = 'OFFICE',
}

@Entity({name: "address"})
export class Address {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    addressId: string

    @Column({default: AddressType.HOME})
    addressType:AddressType

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

    @ManyToOne(()=> User, (user)=> user.addresses)
    @JoinColumn({ name: 'user' })
    user: User

    @OneToMany(() => Order, order => order.address)
    orders: Order[];
}
