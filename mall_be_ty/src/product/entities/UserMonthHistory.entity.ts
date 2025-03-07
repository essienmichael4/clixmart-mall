import { Entity, Column, PrimaryColumn } from "typeorm"
export type Status = "CANCELLED" | "PENDING" | "HELD" | "COMPLETED"

@Entity()
export class UserMonthHistory {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    day: number;

    @PrimaryColumn()
    month: number;

    @PrimaryColumn()
    year: number;

    @Column()
    orders: number;

    @Column()
    products: number;

    @Column("float")
    revenue: number;

    @Column()
    stores: number;
}
