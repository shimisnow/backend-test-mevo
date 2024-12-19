import { Injectable } from '@nestjs/common';
import { UploadRepository } from './repositories/uploads/upload.repository';

@Injectable()
export class DatabaseService {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async registerFile(baseDir: string, filename: string): Promise<number> {
    return await this.uploadRepository.registerUpload(baseDir, filename);
  }
}
