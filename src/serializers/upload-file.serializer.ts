import { InvalidOperationsSerializer } from './invalid-operations.serializer';

export class UploadFileSerializer {
  operations: {
    total: number;
    valid: number;
    invalid: number;
  };

  invalidOperations?: Array<InvalidOperationsSerializer>;
}
