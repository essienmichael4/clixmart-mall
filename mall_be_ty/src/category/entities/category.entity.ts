import { Deleted } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubCategory } from "./subcategory.entity";
import { Product } from "src/product/entities/product.entity";

@Entity({name: "category"})
export class Category {
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

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
    subCategory: SubCategory[];

    @OneToMany(() => Product, (Product) => Product.category)
    products: Product[];
}
