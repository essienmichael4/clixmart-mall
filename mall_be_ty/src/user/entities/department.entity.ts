import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany
} from "typeorm";
import { User } from "./user.entity";
import { Delivery } from "src/delivery/entities/delivery.entity";

@Entity({ name: "department" })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.departments)
  admins?: User[];

  @OneToMany(() => Delivery, (delivery) => delivery.department)
  deliveries?: Delivery[];
}
