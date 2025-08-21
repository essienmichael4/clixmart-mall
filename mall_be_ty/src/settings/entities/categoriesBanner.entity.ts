import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "categoryBanner"})
export class CategoryBanner {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name:string

    @Column({ nullable: true })
    link:string

    @Column({nullable: true})
    imageName:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
