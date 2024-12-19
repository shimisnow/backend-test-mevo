import { Injectable } from '@nestjs/common';
import { UploadRepository } from './repositories/uploads/upload.repository';
import { TransactionRepository } from './repositories/transactions/transaction.repository';
import { RegisterTransactionDto } from '../dtos/register-transaction.dto';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async registerFile(baseDir: string, filename: string): Promise<number> {
    return await this.uploadRepository.registerUpload(baseDir, filename);
  }

  async registerTransaction(data: RegisterTransactionDto) {
    return await this.transactionRepository.registerTransaction(data);
  }
}
