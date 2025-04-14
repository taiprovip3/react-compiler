import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

dotenv.config();

@Injectable()
export class MinioService {
  private s3Client: S3Client;
  private readonly bucket = 'blog-db-avatars';

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: this.configService.get<string>('MINIO_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
      },
    });
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    // return avatarUrl if upload success
    const ext = extname(file.originalname);
    const key = `avatar_${uuidv4()}${ext}`;

    // Resize
    const resizedImage = await sharp(file.buffer).resize(256, 256).toBuffer();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: resizedImage,
        ContentType: file.mimetype,
      }),
    );

    return `${this.configService.get<string>('MINIO_ENDPOINT')}/${this.bucket}/${key}`;
  }

  async deleteAvatarByUrl(url: string) {
    try {
      const key = url.split(`/${this.bucket}/`)[1];
      if (!key) {
        return;
      }
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      console.warn('Không thể xóa avatar cũ', error.message);
      throw new InternalServerErrorException(
        'Can"t delete avatar when delete avatar by URL!',
      );
    }
  }
}
