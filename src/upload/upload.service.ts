import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: any,
    private readonly configService: ConfigService,
  ) {}

  private streamUpload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    const options = {
      folder,
      resource_type: 'auto',
    };
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFile(
    files: Express.Multer.File[],
  ): Promise<CloudinaryResponse[]> {
    const uploadedFiles = [] as CloudinaryResponse[];
    for (const file of files) {
      try {
        const folder = this.configService.get('CLOUDINARY_FOLDER');
        const result = await this.streamUpload(file, folder);
        uploadedFiles.push(result);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
      }
    }

    return uploadedFiles;
  }
}
