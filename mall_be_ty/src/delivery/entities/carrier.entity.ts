import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Vehicle } from "./vehicle.entity";
import { Driver } from "./driver.entity";
import { Shipment } from "./shipment.entity";
import { Hub } from "src/hub/entities/hub.entity";

export enum CarrierStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
}

@Entity({ name: "carrier" })
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: CarrierStatus, default: CarrierStatus.AVAILABLE })
  status: string;

  @ManyToOne(() => Hub, (hub) => hub.carriers)
  @JoinColumn({ name: "hubId" })
  hub: Hub;

  @Column()
  hubId: number;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.carrier)
  vehicles: Vehicle[];

  @OneToMany(() => Driver, (driver) => driver.carrier)
  drivers: Driver[];

  @OneToMany(() => Shipment, (shipment) => shipment.carrier)
  shipments: Shipment[];
}
