import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name: "tag"})
export class Tag {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true})
    name:string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Product, (product) => product.tags)
    products: Product[];
}