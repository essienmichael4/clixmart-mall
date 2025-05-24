import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductOption } from "./productOption.entity";

@Entity({ name: "product_option_value" })
export class ProductOptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string; // e.g., "Red", "Large"

  @ManyToOne(() => ProductOption, (option) => option.values, { onDelete: "CASCADE" })
  @JoinColumn({ name: "optionId" })
  option: ProductOption;
}
