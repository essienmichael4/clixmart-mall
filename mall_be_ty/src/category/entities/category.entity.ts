// import { Deleted } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubCategory } from "./subcategory.entity";
import { Product } from "src/product/entities/product.entity";
import { Brand } from "src/brand/entities/brand.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

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
    subCategories: SubCategory[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @ManyToMany(() => Brand, (brand) => brand.categories)
    @JoinTable()
    brands: Brand[];
}
