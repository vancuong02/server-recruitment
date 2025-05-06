import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from '@/users/users.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyModel, CompanyDocument } from './schemas/company.schema';
import { QueryCompanyDto } from './dto/query-company.dto';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(CompanyModel.name)
        private companyModel: SoftDeleteModel<CompanyDocument>,
    ) {}

    private async checkCompanyExists(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Id công ty không hợp lệ');
        }
        const company = await this.companyModel.findOne({ _id: id });
        if (!company) {
            throw new NotFoundException('Công ty không tồn tại trong hệ thống');
        }
    }

    async create(user: IUser, createCompanyDto: CreateCompanyDto) {
        const company = await this.companyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: company._id,
            createdAt: company.createdAt,
        };
    }

    async update(user: IUser, id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.checkCompanyExists(id);
        await this.companyModel.updateOne(
            { _id: id },
            {
                ...updateCompanyDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
        return {
            _id: id,
            updatedAt: new Date(),
        };
    }

    async findAll(query: QueryCompanyDto) {
        const { name, location, current, pageSize } = query;
        const defaultCurrent = current ? current : 1;
        const defaultPageSize = pageSize ? pageSize : 10;
        const skip = (defaultCurrent - 1) * defaultPageSize;

        const condition = {};
        if (name) {
            condition['name'] = { $regex: new RegExp(name, 'i') };
        }
        if (location) {
            condition['location'] = { $regex: new RegExp(location, 'i') };
        }

        const [items, totalItems] = await Promise.all([
            this.companyModel.find(condition).skip(skip).limit(defaultPageSize),
            this.companyModel.countDocuments(condition),
        ]);

        return {
            meta: {
                currentPage: defaultCurrent,
                pageSize: defaultPageSize,
                totalPages: Math.ceil(totalItems / defaultPageSize),
                totalItems,
            },
            result: items,
        };
    }

    async findOne(id: string) {
        await this.checkCompanyExists(id);
        return await this.companyModel.findById(id);
    }

    async remove(user: IUser, id: string) {
        await this.checkCompanyExists(id);
        await this.companyModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
        await this.companyModel.softDelete({ _id: id });
    }
}
