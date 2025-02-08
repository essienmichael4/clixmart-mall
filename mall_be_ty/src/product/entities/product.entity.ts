import { Category } from "src/category/entities/category.entity";
import { SubCategory } from "src/category/entities/subcategory.entity";
import { Store } from "src/store/entities/store.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductReview } from "./review.entity";
import { ProductImage } from "./productImage.entity";
import { Tag } from "./tag.entity";
import { Brand } from "src/brand/entities/brand.entity";

export enum Discounted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum Status {
    DRAFT = 'DRAFT',
    PUBLISH = 'PUBLISH',
    ARCHIVE = 'ARCHIVE'
}

export enum Inventory {
    INSTOCK = 'INSTOCK',
    OUTSTOCK = 'OUTSTOCK'
}

@Entity({name: "product"})
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name:string

    @Column('float')
    price: number;

    @Column({nullable: true, type: "text"})
    description: string;

    @Column({nullable: true, default: 0})
    discount: number;

    @Column({ default: Discounted.FALSE })
    isDiscounted: Discounted;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: Status.DRAFT })
    status:Status

    @Column({ default: Inventory.INSTOCK })
    inventory:Inventory

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'addedBy' })
    user: User;

    @ManyToOne(() => Store, (store) => store.products)
    @JoinColumn({ name: 'ownedBy' })
    store: Store;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category' })
    category: Category;

    @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
    @JoinColumn({ name: 'subCategory' })
    subCategory: SubCategory;

    @OneToOne(()=> ProductReview, (productReview) => productReview.product, {cascade: true})
    @JoinColumn()
    productReview: ProductReview

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    productImages: ProductImage[];

    @OneToMany(() => Tag, (tag) => tag.products)
    tags: Tag[];

    
    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn()
    brand: Brand;
}
