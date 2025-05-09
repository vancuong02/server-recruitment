import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { IUser } from '@/users/users.interface';
import { QueryCompanyDto } from './dto/query-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyModel, CompanyDocument } from './schemas/company.schema';

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
        const { _id, email } = user;
        const company = await this.companyModel.create({
            ...createCompanyDto,
            createdBy: { _id, email },
        });

        return {
            _id: company._id,
            createdAt: company.createdAt,
        };
    }

    async update(user: IUser, id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.checkCompanyExists(id);
        const { _id, email } = user;

        await this.companyModel.updateOne(
            { _id: id },
            {
                $set: {
                    ...updateCompanyDto,
                    updatedBy: { _id, email },
                },
            },
        );
        return {
            _id: id,
            updatedAt: new Date(),
        };
    }

    async findAll(query: QueryCompanyDto) {
        const { name, location, current = 1, pageSize = 10 } = query;
        const currentPage = Number(current);
        const itemsPerPage = Number(pageSize);
        const skip = (currentPage - 1) * itemsPerPage;

        const condition: Record<string, any> = {};
        if (name) condition.name = { $regex: name, $options: 'i' };
        if (location) condition.location = { $regex: location, $options: 'i' };

        const [items, total] = await Promise.all([
            this.companyModel
                .find(condition)
                .skip(skip)
                .limit(itemsPerPage)
                .lean(),
            this.companyModel.countDocuments(condition),
        ]);

        return {
            meta: {
                current: currentPage,
                pageSize: itemsPerPage,
                pages: Math.ceil(total / itemsPerPage),
                total,
            },
            result: items,
        };
    }

    async findOne(id: string) {
        await this.checkCompanyExists(id);
        return await this.companyModel.findById(id).lean();
    }

    async remove(user: IUser, id: string) {
        await this.checkCompanyExists(id);
        const { _id, email } = user;
        await this.companyModel.updateOne(
            { _id: id },
            {
                $set: {
                    deletedBy: { _id, email },
                },
            },
        );
        await this.companyModel.softDelete({ _id: id });
    }
}
