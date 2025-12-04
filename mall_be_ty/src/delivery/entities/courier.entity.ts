
import { Hub } from "src/hub/entities/hub.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Shipment } from "./shipment.entity";

@Entity({ name: "courier" })
export class Courier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleType: string;

  @Column({ nullable: true })
  licenseNumber?: string;
  
  @ManyToOne(() => Hub, (hub) => hub.couriers)
  @JoinColumn({ name: "hubId" })
  hub: Hub;

  @Column()
  hubId: number;

  @ManyToOne(() => User, (user) => user.courier, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number; // ✅ Foreign key exposed directly if needed

  @OneToMany(() => Shipment, (shipment) => shipment.courier)
  shipments: Shipment[];
}
