import path from 'path';
import {
    MulterModuleOptions,
    MulterOptionsFactory,
} from '@nestjs/platform-express';
import multerS3 from 'multer-s3';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId:
                    this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>(
                    'AWS_SECRET_ACCESS_KEY',
                ),
            },
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: multerS3({
                s3: this.s3Client,
                bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
                key: (req, file, cb) => {
                    const folder =
                        (req as Request).headers?.folder_type ?? 'default';
                    const extName = path.extname(file.originalname);
                    const baseName = path.basename(file.originalname, extName);
                    const finalName = `${folder}/${baseName}-${Date.now()}${extName}`;
                    cb(null, finalName);
                },
            }),
        };
    }
}
