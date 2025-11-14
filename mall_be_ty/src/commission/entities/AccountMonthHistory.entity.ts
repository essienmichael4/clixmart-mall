import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "accountMonthHistory" })
export class AccountMonthHistory {
    @PrimaryColumn()
    day: number;

    @PrimaryColumn()
    month: number;

    @PrimaryColumn()
    year: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalCommission: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalTax: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalShipping: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
