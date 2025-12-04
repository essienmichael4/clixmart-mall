import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, } from "typeorm";
import { Mmda } from "./metropolitan.entity";
import { Hub } from "./hub.entity";

@Entity("town")
export class Town {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Osu", "Adabraka", "Tafo", "Tanokrom"

  @Column({ nullable: true })
  postcode?: string;

  @Column({ nullable: true })
  landmark?: string; // e.g., "Near Oxford Street Mall"

  @Column({ nullable: true })
  latitude?: string;

  @Column({ nullable: true })
  longitude?: string;

  @ManyToOne(() => Mmda, (mmda) => mmda.towns, {
    onDelete: "CASCADE",
  })
  mmda: Mmda;

  @OneToMany(() => Hub, (hub) => hub.mmda)
  hubs: Hub[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
