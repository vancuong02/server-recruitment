import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
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

    async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
            Key: key,
        });

        try {
            await this.s3Client.send(command);
            return true;
        } catch (error) {
            console.error('Error deleting file from S3:', error);
            return false;
        }
    }
}
