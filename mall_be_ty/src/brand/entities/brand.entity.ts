import { Category } from "src/category/entities/category.entity";
import { SubCategory } from "src/category/entities/subcategory.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "brand"})
export class Brand {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    brandId: string

    @Column({unique:true})
    name:string

    @Column({nullable: true})
    url:string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

    @ManyToMany(() => Category, (category) => category.brands)
    categories: Category[];

    @ManyToMany(() => SubCategory, (subCategory) => subCategory.brands)
    subCategories: SubCategory[];
}
