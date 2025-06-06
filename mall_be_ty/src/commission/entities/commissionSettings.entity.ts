import { Category } from "src/category/entities/category.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CommissionSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 5, scale: 2  })
    rate: number; // e.g. 15% will be converted to 0.15
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(()=> Category, (category)=> category.commision, {cascade: true})
    @JoinColumn()
    category: Category
}
