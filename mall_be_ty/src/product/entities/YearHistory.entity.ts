import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity({name: "year_history"})
export class YearHistory {
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
    users: number;

    @Column({ default:0 })
    stores: number;
}
