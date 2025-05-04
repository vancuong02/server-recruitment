import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: SoftDeleteModel<CompanyDocument>,
    ) {}

    async create(createCompanyDto: CreateCompanyDto) {
        const newCompany = new this.companyModel(createCompanyDto);
        await newCompany.save();
        return {
            message: 'Tạo công ty thành công',
            data: newCompany,
        };
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.companyModel.updateOne({ _id: id }, updateCompanyDto);
        return {
            message: 'Cập nhật công ty thành công',
        };
    }

    async findAll() {
        return await this.companyModel.find();
    }

    async findOne(id: string) {
        return await this.companyModel.findOne({ _id: id });
    }

    async remove(id: string) {
        await this.companyModel.softDelete({ _id: id });
        return {
            message: 'Xóa công ty thành công',
        };
    }
}
