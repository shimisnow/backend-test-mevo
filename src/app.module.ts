import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      dest: process.env.UPLOADS_TEMP_DIR,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
