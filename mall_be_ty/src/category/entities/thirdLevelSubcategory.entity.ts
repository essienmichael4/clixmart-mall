import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { SecondLevelSubCategory } from "./secondLevelSubCategory.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "thirdLevelSubCategory"})
export class ThirdLevelSubCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    thirdLevelSubCategoryId: string

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

    @OneToMany(() => Product, (Product) => Product.thirdLevelSubCategory)
    products: Product[];

    @ManyToOne(() => SecondLevelSubCategory, (subsub) => subsub.thirdLevelSubCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'secondLevelSubCategory' })
    secondLevelSubCategory: SecondLevelSubCategory;
}
