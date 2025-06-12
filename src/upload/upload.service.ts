import { Injectable } from '@nestjs/common';
import { cloudinary } from '../config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      upload.end(file.buffer);
    });
  }

  async deleteFile(publicId: string) {
    return await cloudinary.uploader.destroy(publicId);
  }
} 