import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schemas/company.schema';

@Module({
    controllers: [CompaniesController],
    providers: [CompaniesService],
    imports: [
        MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    ],
})
export class CompaniesModule {}
