import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterConfigService } from '@/config/multer.config';

@Module({
    controllers: [FilesController],
    providers: [FilesService],
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService,
        }),
    ],
})
export class FilesModule {}
