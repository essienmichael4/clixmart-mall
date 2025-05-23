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

    @Column({ default:0 })
    orders: number;

    @Column({ default:0 })
    products: number;

    @Column({ type: "float", default: 0 })
    revenue: number;

    @Column({ default:0 })
    stores: number;
}
