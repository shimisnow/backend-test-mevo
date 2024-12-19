import { InvalidOperationMotiveEnum } from 'src/enums/invalid-operation-motive.enum';

export class InvalidOperationsSerializer {
  id: number;
  to: number;
  from: number;
  amount: number;
  motive: InvalidOperationMotiveEnum;
}
