import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatusEnum } from '../enums/transaction-status.enum';
import { TransactionInvalidMotiveEnum } from '../enums/transaction-invalid-motive.enum';

@Entity({
  name: 'transactions',
})
export class TransactionEntity {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk_transactions',
  })
  id: number;

  @Column({
    name: 'to',
    type: 'varchar',
    nullable: false,
  })
  to: string;

  @Column({
    name: 'from',
    type: 'varchar',
    nullable: false,
  })
  from: string;

  @Column({
    name: 'amount',
    type: 'bigint',
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TransactionStatusEnum,
    enumName: 'transactions_status_enum',
    nullable: false,
  })
  status: TransactionStatusEnum;

  @Column({
    name: 'invalid_motive',
    type: 'enum',
    enum: TransactionInvalidMotiveEnum,
    enumName: 'transactions_invalid_motive_enum',
    nullable: true,
  })
  invalidMotive?: TransactionInvalidMotiveEnum;

  @Column({
    name: 'warning',
    type: 'boolean',
    nullable: true,
  })
  warning?: boolean;
}
