import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { HubType } from './hub-type.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Region } from './region.entity';
import { Mmda } from './metropolitan.entity';

@Entity('hub')
export class Hub {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string; // ACC-HUB-001

    @Column()
    name: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => User, { nullable: true })
    manager?: User;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    latitude?: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    longitude?: number;

    // OPTIONAL: Belongs to a Region
    @ManyToOne(() => Region, (region) => region.hubs, {
        nullable: true,
        onDelete: "SET NULL",
    })
    region?: Region;

    // OPTIONAL: Belongs to an MMDA
    @ManyToOne(() => Mmda, (mmda) => mmda.hubs, {
        nullable: true,
        onDelete: "SET NULL",
    })
    mmda?: Mmda;

    // --- Many-to-Many HubTypes ---
    @ManyToMany(() => HubType, (type) => type.hubs, { eager: true })
    @JoinTable({
        name: 'hub_hub_types', // pivot table name
        joinColumn: { name: 'hub_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'hub_type_id', referencedColumnName: 'id' },
    })
    types: HubType[];

    @OneToMany(() => User, (user) => user.hub)
    users: User[];

    @OneToMany(() => Delivery, (delivery) => delivery.hub)
    deliveries: Delivery[];

    @OneToMany(() => Delivery, delivery => delivery.pickupHub)
    pickupDeliveries: Delivery[];

    @OneToMany(() => Delivery, delivery => delivery.dropoffHub)
    dropoffDeliveries: Delivery[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
