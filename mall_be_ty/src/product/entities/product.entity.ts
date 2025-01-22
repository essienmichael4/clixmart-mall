import { Category } from "src/category/entities/category.entity";
import { SubCategory } from "src/category/entities/subcategory.entity";
import { Store } from "src/store/entities/store.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductReview } from "./review.entity";
import { ProductImage } from "./productImage.entity";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

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

    @OneToOne(()=> ProductReview, (productReview)=> productReview.product, {cascade: true})
    @JoinColumn()
    productReview: ProductReview

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    productImage: ProductImage[];
}
