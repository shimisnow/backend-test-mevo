import { Injectable } from '@nestjs/common';
import { UploadFileSerializer } from './serializers/upload-file.serializer';
import * as csv from 'csvtojson';

export class Transaction {
  to: number;
  from: number;
  amount: number;
}

@Injectable()
export class AppService {
  private transactions: Array<Transaction> = [
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

  processCSV(file: Express.Multer.File): UploadFileSerializer {
    csv({ delimiter: ';' })
      .fromFile(file.path)
      .then((jsonObj) => {
        console.log(jsonObj);
        /**
         * [
         * 	{a:"1", b:"2", c:"3"},
         * 	{a:"4", b:"5". c:"6"}
         * ]
         */
      });

    return null;

    // +50k suspect
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
