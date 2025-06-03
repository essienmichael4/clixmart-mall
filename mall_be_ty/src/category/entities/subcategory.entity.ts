import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "src/product/entities/product.entity";
import { Brand } from "src/brand/entities/brand.entity";
import { SecondLevelSubCategory } from "./secondLevelSubCategory.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "subCategory"})
export class SubCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    subCategoryId: string

    @Column({ unique: true })
    name:string

    @Column({ unique: true })
    slug:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @ManyToOne(() => Category, (category) => category.subCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categorySub' }) 
    category: Category;

    @OneToMany(() => Product, (Product) => Product.subCategory)
    products: Product[];

    @ManyToMany(() => Brand, (brand) => brand.subCategories)
    @JoinTable()
    brands: Brand[];

    @OneToMany(() => SecondLevelSubCategory, (secondLevelSub) => secondLevelSub.subCategory, { cascade: true })
    secondLevelSubCategories: SecondLevelSubCategory[];
}
