import { Module } from '@nestjs/common';
import { UploadEntity } from '../../entities/upload.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadRepository } from './upload.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UploadEntity])],
  providers: [UploadRepository],
  exports: [UploadRepository],
})
export class UploadRepositoryModule {}
