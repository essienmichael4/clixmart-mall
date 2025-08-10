import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: "product_specification" })
export class ProductSpecification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Color / Size"

  @Column()
  value: string; // e.g., "Red / Large"

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.specifications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;
}
