import { Injectable } from '@nestjs/common';
import { UploadFileSerializer } from './serializers/upload-file.serializer';
import { TransactionDto } from './dtos/transaction.dto';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { UploadService } from './upload/upload.service';
import { FileDataSerializer } from './serializers/file-data.serializer';
import { DatabaseService } from './database/database.service';
import { DataSource } from 'typeorm';
import { RegisterTransactionDto } from './dtos/register-transaction.dto';
import { TransactionStatusEnum } from './database/enums/transaction-status.enum';
import { TransactionInvalidMotiveEnum } from './database/enums/transaction-invalid-motive.enum';
import { InvalidOperationMotiveEnum } from './enums/invalid-operation-motive.enum';

@Injectable()
export class AppService {
  private transactions: Array<TransactionDto> = [];

  constructor(
    private dataSource: DataSource,
    private readonly uploadService: UploadService,
    private readonly databaseService: DatabaseService,
  ) {}

  async processFile(file: Express.Multer.File): Promise<UploadFileSerializer> {
    const response: UploadFileSerializer = {
      operations: {
        total: 0,
        valid: 0,
        invalid: 0,
      },
      invalidOperations: [],
    };

    // uploads the file
    const fileData: FileDataSerializer = this.uploadService.uploadFile(file);

    // save metadata to database
    const uploadId = await this.registerFileMetada(
      fileData.folder,
      fileData.name,
    );

    const data = await this.convertFileToJSON(fileData.path);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    // insert the first value
    // this.transactions.push(data.shift());

    data.forEach((transaction) => {
      const duplicated = this.hasEqualTransaction(transaction);

      if (duplicated) {
        this.registerTransaction({
          queryRunner,
          transaction: {
            ...transaction,
            status: TransactionStatusEnum.INVALID,
            invalidMotive: TransactionInvalidMotiveEnum.DUPLICATED,
          },
          uploadId,
        });

        response.invalidOperations.push({
          ...transaction,
          motive: InvalidOperationMotiveEnum.DUPLICATED,
        });
      } else {
        if (transaction.amount < 0) {
          this.registerTransaction({
            queryRunner,
            transaction: {
              ...transaction,
              status: TransactionStatusEnum.INVALID,
              invalidMotive: TransactionInvalidMotiveEnum.NEGATIVE,
            },
            uploadId,
          });

          response.invalidOperations.push({
            ...transaction,
            motive: InvalidOperationMotiveEnum.NEGATIVE,
          });
        } else {
          this.registerTransaction({
            queryRunner,
            transaction: {
              ...transaction,
              status: TransactionStatusEnum.VALID,
              warning: transaction.amount > 5000000,
            },
            uploadId,
          });

          // add to list
          this.insertTransaction(transaction);
        }
      }
    });

    // only commit if all csv lines are processed
    await queryRunner.commitTransaction();

    response.operations.invalid = response.invalidOperations.length;
    response.operations.valid = this.transactions.length;
    response.operations.total =
      response.operations.invalid + response.operations.valid;

    return response;
  }

  private async convertFileToJSON(
    path: string,
  ): Promise<Array<TransactionDto>> {
    const fileBuffer = readFileSync(path);
    const data = fileBuffer.toString('utf16le');

    const finalCSV = await parse(data, {
      header: true,
      skipEmptyLines: true,
    });

    return finalCSV.data;
  }

  private insertTransaction(transaction: TransactionDto) {
    let i = 0;
    // search the position to insert the transaction
    for (i = 0; i < this.transactions.length; i++) {
      if (transaction.from > this.transactions[i].from) {
        this.transactions.splice(i, 0, transaction);
        i = this.transactions.length + 1;
      }
    }
    // if the entire array was processed, transactions needs to be inserted at the end
    if (i == this.transactions.length) {
      this.transactions.push(transaction);
    }
  }

  private hasEqualTransaction(transaction) {
    // find the first transaction with 'from'
    const index = this.transactions.findIndex(
      (t) => t.from == transaction.from,
    );

    // if none, return
    if (index === -1) return false;

    for (let i = index; i < this.transactions.length; i++) {
      // stops the iterator
      if (this.transactions[i].from != transaction.from) {
        return false;
      }

      if (this.transactions[i].to == transaction.to) {
        if (this.transactions[i].amount == transaction.amount) {
          return true;
        }
      }
    }
  }

  private async registerFileMetada(
    baseDir: string,
    filename: string,
  ): Promise<number> {
    return await this.databaseService.registerFile(baseDir, filename);
  }

  private async registerTransaction(data: RegisterTransactionDto) {
    return await this.databaseService.registerTransaction(data);
  }
}
