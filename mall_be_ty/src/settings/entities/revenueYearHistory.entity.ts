import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class RevenueYearHistory {
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
