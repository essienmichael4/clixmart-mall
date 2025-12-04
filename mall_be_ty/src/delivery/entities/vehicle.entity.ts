import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Hub } from "src/hub/entities/hub.entity";
import { Delivery } from "src/delivery/entities/delivery.entity";
import { Carrier } from "./carrier.entity";

export enum VehicleStatus {
  ACTIVE = "ACTIVE",
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED",
}

@Entity({ name: "vehicle" })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  registrationNumber: string; // e.g. GT-2345-23

  @Column()
  brand: string; // e.g. Toyota, Kia, Hyundai

  @Column({ nullable: true })
  model: string; // e.g. Hiace, Frontier, Mighty

  @Column()
  type: string; // Van, Truck, Motorbike, Pickup

  @Column({ type: "float", nullable: true })
  capacityKg: number; // cargo capacity

  @Column({ type: "int", nullable: true })
  year: number;

  @Column({ type: "enum", enum: VehicleStatus, default: VehicleStatus.ACTIVE })
  status: VehicleStatus;

  @ManyToOne(() => Carrier, (carrier) => carrier.vehicles)
  @JoinColumn({ name: "carrierId" })
  carrier: Carrier;

  @Column()
  carrierId: number;

  @OneToMany(() => Delivery, (delivery) => delivery.vehicle)
  deliveries: Delivery[];

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  vin: string; // optional unique identifier

  @Column({ nullable: true })
  lastServiceDate: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
