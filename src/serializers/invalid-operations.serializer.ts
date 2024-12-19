import { InvalidOperationMotiveEnum } from 'src/enums/invalid-operation-motive.enum';

export class InvalidOperationsSerializer {
  to: string;
  from: string;
  amount: number;
  motive: InvalidOperationMotiveEnum;
}
