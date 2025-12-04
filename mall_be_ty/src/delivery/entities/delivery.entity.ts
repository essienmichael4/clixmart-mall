import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Hub } from 'src/hub/entities/hub.entity';
import { Mmda } from 'src/hub/entities/metropolitan.entity';
import { Department } from 'src/user/entities/department.entity';
import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum DeliveryType {
  PICKUP = 'PICKUP',
  DROPOFF = 'DROPOFF',
  RETURN = 'RETURN',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trackingNumber: string; // ex: DEL-ACC-0001

  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.PICKUP,
  })
  type: DeliveryType;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column()
  recipientName: string;

  @Column()
  recipientPhone: string;

  @Column()
  recipientAddress: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude?: number;

  // User who created the delivery
  @ManyToOne(() => User, (user) => user.createdDeliveries, { nullable: true })
  createdBy?: User;

  // User assigned to deliver
  @ManyToOne(() => User, (user) => user.assignedDeliveries, { nullable: true })
  assignedTo?: User;

  // USER RELATIONS
  @ManyToOne(() => User, (user) => user.sentDeliveries, {
    onDelete: "SET NULL",
    nullable: true,
  })
  sender?: User;

  @ManyToOne(() => User, (user) => user.receivedDeliveries, {
    onDelete: "SET NULL",
    nullable: true,
  })
  receiver?: User;

  // GHANA MMDA RELATIONS
  @ManyToOne(() => Mmda, { nullable: true })
  @JoinColumn({ name: "pickupMmdaId" })
  pickupMmda?: Mmda;

  @ManyToOne(() => Mmda, { nullable: true })
  @JoinColumn({ name: "dropoffMmdaId" })
  dropoffMmda?: Mmda;

  @ManyToOne(() => Driver, (driver) => driver.deliveries, {
    nullable: true,
    onDelete: "SET NULL",
  })
  driver: Driver;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.deliveries, {
    nullable: true,
    onDelete: "SET NULL",
  })
  vehicle: Vehicle;

  @ManyToOne(() => Hub, hub => hub.deliveries, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "hubId" })
  hub?: Hub;

  @ManyToOne(() => Hub, { nullable: true })
  @JoinColumn({ name: "pickupHubId" })
  pickupHub?: Hub;

  @ManyToOne(() => Hub, { nullable: true })
  @JoinColumn({ name: "dropoffHubId" })
  dropoffHub?: Hub;

  @ManyToOne(() => Department, department => department.deliveries, { nullable: true })
  @JoinColumn({ name: "departmentId" })
  department?: Department;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
