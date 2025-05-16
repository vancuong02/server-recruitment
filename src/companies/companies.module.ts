import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModel, CompanySchema } from './schemas/company.schema';
import { JobModel, JobSchema } from '@/jobs/schemas/job.schema';

@Module({
    controllers: [CompaniesController],
    providers: [CompaniesService],
    imports: [
        MongooseModule.forFeature([
            { name: CompanyModel.name, schema: CompanySchema },
            { name: JobModel.name, schema: JobSchema },
        ]),
    ],
})
export class CompaniesModule {}
