import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'

import { IUser } from '@/users/users.interface'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { CompanyModel, CompanyDocument } from './schemas/company.schema'
import { JobDocument, JobModel } from '@/jobs/schemas/job.schema'
import { ICompanyWithJobCount, IFindAllResponse, QueryCompanyDto } from './dto/interface-company.dto'

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(CompanyModel.name)
        private companyModel: SoftDeleteModel<CompanyDocument>,
        @InjectModel(JobModel.name)
        private jobModel: SoftDeleteModel<JobDocument>,
    ) {}

    private async checkCompanyExists(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Id công ty không hợp lệ')
        }
        const company = await this.companyModel.findOne({ _id: id })
        if (!company) {
            throw new NotFoundException('Công ty không tồn tại trong hệ thống')
        }
    }

    async create(user: IUser, createCompanyDto: CreateCompanyDto) {
        const { _id, email } = user
        const company = await this.companyModel.create({
            ...createCompanyDto,
            createdBy: { _id, email },
        })

        return {
            _id: company._id,
            createdAt: company.createdAt,
        }
    }

    async update(user: IUser, id: string, updateCompanyDto: UpdateCompanyDto) {
        await this.checkCompanyExists(id)
        const { _id, email } = user

        await this.companyModel.updateOne(
            { _id: id },
            {
                $set: {
                    ...updateCompanyDto,
                    updatedBy: { _id, email },
                },
            },
        )
        return {
            _id: id,
            updatedAt: new Date(),
        }
    }

    async findAll(query: QueryCompanyDto): Promise<IFindAllResponse> {
        const { name, location, current = 1, pageSize = 10 } = query
        const currentPage = Number(current)
        const itemsPerPage = Number(pageSize)
        const skip = (currentPage - 1) * itemsPerPage

        const condition: Record<string, any> = {}
        if (name) condition.name = { $regex: name, $options: 'i' }
        if (location) condition.location = { $regex: location, $options: 'i' }

        const [items, total] = await Promise.all([
            this.companyModel.find<CompanyDocument>(condition).skip(skip).limit(itemsPerPage).lean(),
            this.companyModel.countDocuments(condition),
        ])

        const companiesWithJobCount = (await Promise.all(
            items.map(async (company) => {
                const jobCount = await this.jobModel.countDocuments({
                    companyId: company._id,
                    isDeleted: false,
                })
                return {
                    ...company,
                    jobCount,
                }
            }),
        )) as ICompanyWithJobCount[]

        return {
            meta: {
                current: currentPage,
                pageSize: itemsPerPage,
                pages: Math.ceil(total / itemsPerPage),
                total,
            },
            result: companiesWithJobCount,
        }
    }

    async findOne(id: string) {
        await this.checkCompanyExists(id)
        return await this.companyModel.findById(id).lean()
    }

    async remove(user: IUser, id: string) {
        await this.checkCompanyExists(id)
        const { _id, email } = user
        await this.companyModel.updateOne(
            { _id: id },
            {
                $set: {
                    deletedBy: { _id, email },
                },
            },
        )
        await this.companyModel.softDelete({ _id: id })
    }
}
