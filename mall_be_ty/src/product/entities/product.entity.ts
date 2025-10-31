import { Category } from "src/category/entities/category.entity";
import { SubCategory } from "src/category/entities/subcategory.entity";
import { Store } from "src/store/entities/store.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductReview } from "./review.entity";
import { ProductImage } from "./productImage.entity";
import { Tag } from "./tag.entity";
import { Brand } from "src/brand/entities/brand.entity";
import { OrderItem } from "src/order/entities/orderItem.entity";
import { ProductOption } from "./productOption.entity";
import { ThirdLevelSubCategory } from "src/category/entities/thirdLevelSubcategory.entity";
import { SecondLevelSubCategory } from "src/category/entities/secondLevelSubCategory.entity";
import { ProductSpecification } from "./productSpecification.entity";

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

    @Column({type: "uuid", unique:true})
    productId: string

    @Column()
    name:string

    @Column({nullable: true})
    searchName:string

    @Column({type: 'float', default: 0.00})
    price: number;

    @Column({type: 'float', default: 0.00})
    actualPrice: number;

    @Column({nullable: true})
    quantity: number;

    @Column({nullable: true})
    sku: string;

    @Column({nullable: true})
    imageName: string;

    @Column({nullable: true, type: "text"})
    description: string;

    @Column({nullable: true, default: 0})
    discount: number;

    @Column({nullable: true})
    model: string;

    @Column({nullable: true})
    slug: string;

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

    @ManyToOne(() => SecondLevelSubCategory, (secondSubCategory) => secondSubCategory.products)
    @JoinColumn({ name: 'secondLevelSubCategory' })
    secondLevelSubCategory: SecondLevelSubCategory;

    @ManyToOne(() => ThirdLevelSubCategory, (thirdSubCategory) => thirdSubCategory.products)
    @JoinColumn({ name: 'thirdLevelSubCategory' })
    thirdLevelSubCategory: ThirdLevelSubCategory;

    @OneToOne(()=> ProductReview, (productReview) => productReview.product, {cascade: true})
    @JoinColumn()
    productReview: ProductReview

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    productImages: ProductImage[];

    @ManyToMany(() => Tag, (tag) => tag.products)
    @JoinTable()
    tags: Tag[];
    
    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn()
    brand: Brand;
    
    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @OneToMany(() => ProductOption, (option) => option.product, { cascade: true })
    options: ProductOption[];

    @OneToMany(() => ProductSpecification, (option) => option.product, { cascade: true })
    specifications: ProductSpecification[];
}
