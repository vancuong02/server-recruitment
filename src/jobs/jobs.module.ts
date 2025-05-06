import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { JobModel, JobSchema } from './schemas/job.schema';

@Module({
    controllers: [JobsController],
    providers: [JobsService],
    imports: [
        MongooseModule.forFeature([{ name: JobModel.name, schema: JobSchema }]),
    ],
    exports: [JobsService],
})
export class JobsModule {}
