import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SubCategory } from "./subcategory.entity";
import { Product } from "src/product/entities/product.entity";
import { Brand } from "src/brand/entities/brand.entity";
import { CommissionSetting } from "src/commission/entities/commissionSettings.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "category"})
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    categoryId: string

    @Column({ unique: true })
    name:string

    @Column({ unique: true })
    slug:string

    @Column({nullable: true})
    imageName:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category, { cascade: true })
    subCategories: SubCategory[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @ManyToMany(() => Brand, (brand) => brand.categories)
    @JoinTable()
    brands: Brand[];

    @OneToOne(()=> CommissionSetting, (commision)=> commision.category)
    commision: CommissionSetting
}
