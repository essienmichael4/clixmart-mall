import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Store } from "./store.entity";
import { User } from "src/user/entities/user.entity";

@Entity({name: "follow"})
export class Follow {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => Store, (store) => store.follows)
    @JoinColumn({ name: 'follows' })
    store: Store;

    @ManyToOne(() => User, (user) => user.following)
    @JoinColumn({ name: 'following' })
    user: User;
}