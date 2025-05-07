import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3ConfigService {
    constructor(private configService: ConfigService) {}

    createS3Client() {
        return new S3Client({
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
}
