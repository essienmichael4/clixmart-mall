import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Account } from 'src/commission/entities/commissionAccount.entity';
import { VendorPayout } from 'src/store/entities/vendorPayout.entity';
import { StoreAccount } from 'src/store/entities/storeAccount.entity';

export enum LedgerType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Entity()
export class AccountLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, { onDelete: 'CASCADE', nullable: true })
  account: Account;

  @ManyToOne(() => StoreAccount, { eager: true, nullable: true })
  storeAccount: StoreAccount;

  @ManyToOne(() => VendorPayout, { nullable: true })
  payout: VendorPayout;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: LedgerType })
  type: LedgerType; // CREDIT adds, DEBIT subtracts

  @Column({ nullable: true })
  reference: string; // e.g. payoutRef, transactionId, etc.

  @Column({ nullable: true })
  description: string; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number; // balance after this transaction

  @CreateDateColumn()
  createdAt: Date;
}
