import { Entity, PrimaryGeneratedColumn, Column, OneToMany, } from "typeorm";
import { Mmda } from './metropolitan.entity'
import { Hub } from "./hub.entity";

@Entity("regions")
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; // Example: "Greater Accra", "Ashanti Region"

    @Column({ nullable: true })
    capital?: string; // Example: "Accra", "Kumasi"

    @Column({ nullable: true })
    code?: string; 
    // Example: GA, AR, ER...

    @OneToMany(() => Mmda, (mmda) => mmda.region)
    mmdas: Mmda[];

    @OneToMany(() => Hub, (hub) => hub.region)
    hubs: Hub[];
}
