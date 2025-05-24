import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./product.entity";
import { ProductOptionValue } from "./productOptionValue.entity";

@Entity({ name: "product_variant" })
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true })
  variantId: string;

  @Column()
  name: string; // e.g., "Red / Large"

  @Column({ nullable: true })
  sku: string;

  @Column({ type: "float", default: 0.0 })
  price: number;

  @Column({ type: "int", default: 0 })
  quantity: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  imageName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;

  @ManyToMany(() => ProductOptionValue)
  @JoinTable({
    name: "variant_option_values",
    joinColumn: { name: "variantId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "optionValueId", referencedColumnName: "id" },
  })
  optionValues: ProductOptionValue[];
}
