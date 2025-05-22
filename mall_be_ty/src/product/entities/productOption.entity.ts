import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Product } from "./product.entity";
import { ProductOptionValue } from "./productOptionValue.entity";

@Entity({ name: "product_option" })
export class ProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Color", "Size"

  @ManyToOne(() => Product, (product) => product.options, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;

  @OneToMany(() => ProductOptionValue, (value) => value.option, { cascade: true })
  values: ProductOptionValue[];
}
