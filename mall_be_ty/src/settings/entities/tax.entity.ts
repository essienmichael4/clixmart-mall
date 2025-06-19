import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "tax"})
export class Tax {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    taxId: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    taxPercent: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
