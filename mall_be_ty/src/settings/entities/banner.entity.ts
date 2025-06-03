import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "banner"})
export class Banner {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    bannerId: string

    @Column()
    imageName:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
