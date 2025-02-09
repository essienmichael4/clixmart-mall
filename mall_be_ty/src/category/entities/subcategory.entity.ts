import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "src/product/entities/product.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

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

    @ManyToOne(() => Category, (category) => category.subCategories)
    @JoinColumn({ name: 'categorySub' })
    category: Category;

    @OneToMany(() => Product, (Product) => Product.subCategory)
    products: Product[];
}
