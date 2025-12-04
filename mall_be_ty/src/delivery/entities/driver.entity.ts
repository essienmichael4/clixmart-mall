import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Hub } from "src/hub/entities/hub.entity";
import { Delivery } from "src/delivery/entities/delivery.entity";
import { Vehicle } from "./vehicle.entity";
import { Carrier } from "./carrier.entity";
import { Shipment } from "./shipment.entity";

export enum DriverStatus {
  AVAILABLE = "AVAILABLE",
  ON_TRIP = "ON_TRIP",
  SUSPENDED = "SUSPENDED",
}

@Entity({ name: "driver" })
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.driver, {
        onDelete: "CASCADE", // if user is deleted, driver is deleted
    })
    @JoinColumn() // 👈 creates `userId` FK in driver table
    user: User;

    @ManyToOne(() => Carrier, (carrier) => carrier.drivers)
    @JoinColumn({ name: "carrierId" })
    carrier: Carrier;

    @OneToMany(() => Delivery, (delivery) => delivery.driver)
    deliveries: Delivery[];

    @Column({ type: "enum", enum: DriverStatus, default: DriverStatus.AVAILABLE })
    status: DriverStatus;

    @Column({ nullable: true })
    licenseNumber: string;

    @Column({ type: "date", nullable: true })
    licenseExpiry: Date;

    @ManyToOne(() => Vehicle, { nullable: true, onDelete: "SET NULL" })
    vehicle: Vehicle;

    @OneToMany(() => Shipment, (shipment) => shipment.driver)
    shipments: Shipment[];

    @Column({ nullable: true })
    notes: string; // e.g. “Handles fragile cargo”

    @Column({ nullable: true })
    experienceYears: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
