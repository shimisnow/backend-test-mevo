import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UploadModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
