import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    action: string; // e.g., 'COMMISSION_PROCESSED', 'COMMISSION_REVERSED', 'PAYOUT_INITIATED'

    @Column({ type: 'jsonb', nullable: true })
    data: any; // Payload of the operation

    @CreateDateColumn()
    timestamp: Date;

    @Column({ default: false })
    isError: boolean;

    @Column({ nullable: true })
    errorMessage: string;

    @ManyToOne(() => User, { eager: true })
    performedBy: User;
}
