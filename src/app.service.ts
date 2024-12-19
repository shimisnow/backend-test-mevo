import { Injectable } from '@nestjs/common';
import { UploadFileSerializer } from './serializers/upload-file.serializer';
import { TransactionDto } from './dtos/transaction.dto';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { UploadService } from './upload/upload.service';
import { FileDataSerializer } from './serializers/file-data.serializer';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  private transactions: Array<TransactionDto> = [];

  constructor(
    private readonly uploadService: UploadService,
    private readonly databaseService: DatabaseService,
  ) {}

  async processFile(file: Express.Multer.File): Promise<UploadFileSerializer> {
    const fileData: FileDataSerializer = this.uploadService.uploadFile(file);

    await this.databaseService.registerFile(fileData.folder, fileData.name);

    const data = await this.convertFileToJSON(fileData.path);

    // insert the first value
    this.transactions.push(data.shift());

    data.forEach((transaction) => {
      // TODO verify if transaction is duplicated
      this.insertTransaction(transaction);
    });

    return null;
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

  private validate() {
    // no negative
    // no equal transaction
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

  private searchEqualTransaction() {
    // binarySearch
  }
}
