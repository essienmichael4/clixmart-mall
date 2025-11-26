import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: "profile_image"})
export class ProfileImage {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    profileImageId: string

    @Column()
    url:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(()=> User, (user)=> user.profileImage)
    user: User
}
