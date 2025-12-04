import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "account"})
export class Account {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    accountId: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    currentAccount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    tax: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    shipping: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // @OneToOne(() => Store, (store) => store.financialAccount, { onDelete: "CASCADE" })
    // @JoinColumn()
    // store: Store;
}
