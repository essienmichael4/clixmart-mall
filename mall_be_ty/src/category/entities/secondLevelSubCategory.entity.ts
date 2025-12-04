import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { SubCategory } from "./subcategory.entity";
// import { ThirdLevelSubCategory } from "./thirdLevelSubcategory.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "second_level_sub_category"})
export class SecondLevelSubCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    secondLevelSubCategoryId: string

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

    @OneToMany(() => Product, (Product) => Product.secondLevelSubCategory)
    products: Product[];

    @ManyToOne(() => SubCategory, (sub) => sub.secondLevelSubCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subCategory' })
    subCategory: SubCategory;

    // @OneToMany(() => ThirdLevelSubCategory, (sss) => sss.secondLevelSubCategory, { cascade: true })
    // thirdLevelSubCategories: ThirdLevelSubCategory[];
}
