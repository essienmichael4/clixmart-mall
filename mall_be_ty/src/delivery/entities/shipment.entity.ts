import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany } from "typeorm";
import { Courier } from "./courier.entity";
import { Driver } from "./driver.entity";
import { Hub } from "src/hub/entities/hub.entity";
import { Carrier } from "./carrier.entity";
import { Order } from "src/order/entities/order.entity";
@Entity({ name: "shipment" })
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trackingNumber: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true })
  destination: string;

  @ManyToOne(() => Carrier, (carrier) => carrier.shipments)
  @JoinColumn({ name: "carrierId" })
  carrier: Carrier;

  @Column()
  carrierId: number;

  @ManyToOne(() => Courier, (courier) => courier.shipments)
  @JoinColumn({ name: "courierId" })
  courier: Courier;

  @Column({ nullable: true })
  courierId: number;

  @ManyToOne(() => Driver, (driver) => driver.shipments)
  @JoinColumn({ name: "driverId" })
  driver: Driver;

  @Column({ nullable: true })
  driverId: number;

  @ManyToOne(() => Hub, (hub) => hub.shipments)
  @JoinColumn({ name: "hubId" })
  hub: Hub;

  @Column()
  hubId: number;

  @ManyToMany(() => Order, order => order.shipments, { cascade: false })
  @JoinTable({
    name: "shipment_orders", // ✅ explicit join table
    joinColumn: { name: "shipmentId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "orderId", referencedColumnName: "id" }
  })
  orders: Order[];
}
