import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { existsSync, mkdirSync, renameSync } from 'fs';
import * as path from 'path';
import { FileDataSerializer } from 'src/serializers/file-data.serializer';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File): FileDataSerializer {
    const uploadsDir = process.env.UPLOADS_FINANCIAL_DIR;
    const baseFolder = new Date()
      .toLocaleDateString('en-CA')
      .replace(/-/g, '/');
    const finalLocation = `${uploadsDir}/${baseFolder}`;
    const extension = path.extname(file.originalname);

    mkdirSync(finalLocation, { recursive: true });

    let filename = '';
    let finalPath = '';

    do {
      filename = uuid();
      finalPath = `${finalLocation}/${filename}${extension}`;
    } while (existsSync(finalPath));

    renameSync(file.path, finalPath);

    return {
      path: finalPath,
      folder: baseFolder,
      name: `${filename}${extension}`,
    };
  }
}
