import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "revenue"})
export class Revenue {
    @PrimaryGeneratedColumn()
    id: number

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

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
