import { Injectable } from '@nestjs/common';
import { UploadFileSerializer } from './serializers/upload-file.serializer';

import { TransactionDto } from './dtos/transaction.dto';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';

@Injectable()
export class AppService {
  private transactions: Array<TransactionDto> = [
    {
      to: 12,
      from: 1,
      amount: 5,
    },
    {
      to: 15,
      from: 1,
      amount: 5,
    },
    {
      to: 12,
      from: 1,
      amount: 5,
    },
  ];

  async processFile(file: Express.Multer.File): Promise<UploadFileSerializer> {
    const data = await this.convertFileToJSON(file);
    console.log(data);
    // +50k suspect
    return null;
  }

  async convertFileToJSON(
    file: Express.Multer.File,
  ): Promise<Array<TransactionDto>> {
    const fileBuffer = readFileSync(file.path);
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

  private insertTransaction() {
    // sorted insert
  }

  private searchEqualTransaction() {
    // binarySearch
  }
}
