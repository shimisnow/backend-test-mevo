import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../../entities/transaction.entity';
import { RegisterTransactionDto } from '../../../dtos/register-transaction.dto';
import { UploadEntity } from 'src/database/entities/upload.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async registerTransaction(data: RegisterTransactionDto) {
    const upload = new UploadEntity();
    upload.id = data.uploadId;

    const entity = await this.transactionRepository.create({
      ...data.transaction,
      upload,
    });

    await data.queryRunner.manager.save(entity);
  }
}
