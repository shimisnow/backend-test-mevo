import { TransactionInvalidMotiveEnum } from '../database/enums/transaction-invalid-motive.enum';
import { TransactionStatusEnum } from '../database/enums/transaction-status.enum';
import { QueryRunner } from 'typeorm';

export class RegisterTransactionDto {
  queryRunner: QueryRunner;
  transaction: {
    to: string;
    from: string;
    amount: number;
    status: TransactionStatusEnum;
    invalidMotive?: TransactionInvalidMotiveEnum;
    warning?: boolean;
  };
  uploadId: number;
}
