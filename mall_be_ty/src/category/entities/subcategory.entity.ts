import { Deleted } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "src/product/entities/product.entity";

@Entity({name: "subCategory"})
export class SubCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    name:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @ManyToOne(() => Category, (category) => category.subCategory)
    @JoinColumn({ name: 'categorySub' })
    category: Category;

    @OneToMany(() => Product, (Product) => Product.subCategory)
    products: Product[];
}
