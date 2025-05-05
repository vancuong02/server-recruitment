import { Injectable, NotFoundException } from '@nestjs/common';
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

    private async checkCompanyExists(id: string) {
        const company = await this.companyModel.findById(id);
        if (!company) {
            throw new NotFoundException('Công ty không tồn tại trong hệ thống');
        } else {
            return company;
        }
    }

    async create(createCompanyDto: CreateCompanyDto, user: IUser) {
        return await this.companyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.checkCompanyExists(id);
        await this.companyModel.updateOne({ _id: id }, updateCompanyDto);
    }

    async findAll(page: number, pageSize: number, name?: string) {
        const defaultPage = page ? page : 1;
        const defaultPageSize = pageSize ? pageSize : 10;

        const skip = (defaultPage - 1) * defaultPageSize;

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
                currentPage: defaultPage,
                pageSize: defaultPageSize,
                totalPages: Math.ceil(totalItems / defaultPageSize),
                totalItems,
            },
            result: items,
        };
    }

    async findOne(id: string) {
        return await this.checkCompanyExists(id);
    }

    async remove(id: string) {
        await this.checkCompanyExists(id);
        await this.companyModel.softDelete({ _id: id });
    }
}
