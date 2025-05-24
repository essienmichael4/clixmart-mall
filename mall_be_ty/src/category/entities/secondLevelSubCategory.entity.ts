import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Product } from "src/product/entities/product.entity";
import { Brand } from "src/brand/entities/brand.entity";
import { SubCategory } from "./subcategory.entity";
import { ThirdLevelSubCategory } from "./thirdLevelSubcategory.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "secondLevelSubCategory"})
export class SecondLevelSubCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    secondLevelSubCategory: string

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

    @OneToMany(() => Product, (Product) => Product.subCategory)
    products: Product[];

    @ManyToOne(() => SubCategory, (sub) => sub.secondLevelSubCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subCategory' })
    subCategory: SubCategory;

    @OneToMany(() => ThirdLevelSubCategory, (sss) => sss.secondLevelSubCategory, { cascade: true })
    thirdLevelSubCategories: ThirdLevelSubCategory[];
}
