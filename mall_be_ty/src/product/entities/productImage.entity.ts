import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";
// import { User } from "./user.entity";

@Entity({name: "productImage"})
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    productImageId: string

    @Column()
    url:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => Product, (product) => product.productImages)
    @JoinColumn({ name: 'productImg' })
    product: Product;
}
