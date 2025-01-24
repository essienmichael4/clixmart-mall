import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "brand"})
export class Brand {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    name:string

    @Column()
    url:string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
