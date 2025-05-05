import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from '@/users/users.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: SoftDeleteModel<CompanyDocument>,
    ) {}

    async create(createCompanyDto: CreateCompanyDto, user: IUser) {
        const company = await this.companyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.companyModel.updateOne({ _id: id }, updateCompanyDto);
    }

    async findAll(current: number, pageSize: number, name?: string) {
        const defaultCurrent = current ? current : 1;
        const defaultPageSize = pageSize ? pageSize : 10;

        const skip = (defaultCurrent - 1) * defaultPageSize;

        const condition = {};
        if (name) {
            condition['name'] = { $regex: new RegExp(name, 'i') };
        }

        const [items, totalItems] = await Promise.all([
            this.companyModel
                .find(condition)
                .skip(skip)
                .limit(defaultPageSize)
                .exec(),
            this.companyModel.countDocuments(condition),
        ]);

        return {
            meta: {
                currentPage: defaultCurrent,
                pageSize: defaultPageSize,
                totalPages: Math.ceil(totalItems / defaultPageSize),
                totalItems,
            },
            data: items,
        };
    }

    async findOne(id: string) {
        return await this.companyModel.findOne({ _id: id });
    }

    async remove(id: string) {
        await this.companyModel.softDelete({ _id: id });
    }
}
