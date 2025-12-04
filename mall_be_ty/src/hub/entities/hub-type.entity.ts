import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hub } from './hub.entity';

@Entity('hub_types')
export class HubType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Example: Pickup, Dropoff, Warehouse

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string; // optional icon name

  @ManyToMany(() => Hub, (hub) => hub.types)
  hubs: Hub[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
