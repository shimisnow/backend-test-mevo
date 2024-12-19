import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadEntity } from '../../entities/upload.entity';
import { UploadStatusEnum } from '../../enums/upload-status.enum';

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(UploadEntity)
    private uploadRepository: Repository<UploadEntity>,
  ) {}

  async registerUpload(baseDir: string, filename: string): Promise<number> {
    const result = await this.uploadRepository.save({
      path: baseDir,
      filename,
      status: UploadStatusEnum.PENDING,
    });

    return result.id;
  }
}
