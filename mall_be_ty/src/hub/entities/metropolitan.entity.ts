import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Region } from './region.entity'
import { Town } from './town.entity'
import { Hub } from './hub.entity';

export enum MmdaType {
    METROPOLITAN = "METROPOLITAN",
    MUNICIPAL = "MUNICIPAL",
    DISTRICT = "DISTRICT",
}

@Entity("mmdas")
export class Mmda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: MmdaType,
        nullable: true,
    })
    type: MmdaType;

    @Column({ nullable: true })
    capital?: string;

    @Column({ nullable: true })
    code?: string;

    @ManyToOne(() => Region, (region) => region.mmdas, { onDelete: "CASCADE" })
    region: Region;

    @OneToMany(() => Town, (town) => town.mmda)
    towns: Town[];

    @OneToMany(() => Hub, (hub) => hub.mmda)
    hubs: Hub[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
