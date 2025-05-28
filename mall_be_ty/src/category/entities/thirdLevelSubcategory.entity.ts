import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "src/product/entities/product.entity";
import { Brand } from "src/brand/entities/brand.entity";
import { SecondLevelSubCategory } from "./secondLevelSubCategory.entity";
// import { SecondLevelSubcategory } from "./secondLevelSubCategory.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "thirdLevelSubCategory"})
export class ThirdLevelSubCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    ThirdLevelSubCategoryId: string

    @Column({
        unique: true
    })
    name:string

    @Column({
        unique: true
    })
    slug:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @OneToMany(() => Product, (Product) => Product.subCategory)
    products: Product[];

    @ManyToOne(() => SecondLevelSubCategory, (subsub) => subsub.thirdLevelSubCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'secondLevelSubCategoryId' })
    secondLevelSubCategory: SecondLevelSubCategory;
}
