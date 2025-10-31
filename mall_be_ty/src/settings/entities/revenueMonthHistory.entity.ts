import { Entity, Column, PrimaryColumn } from "typeorm"
// export type Status = "CANCELLED" | "PENDING" | "HELD" | "COMPLETED"

@Entity()
export class RevenueMonthHistory {
    @PrimaryColumn()
    day: number;

    @PrimaryColumn()
    month: number;

    @PrimaryColumn()
    year: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable:true, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    taxRevenue: number

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable:true, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    soldRevenue: number

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable:true, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    vendorEarnings: number

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable:true, transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
    }})
    commissionRevenue: number
}
