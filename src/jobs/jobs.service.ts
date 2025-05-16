import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IUser } from '@/users/users.interface';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobDocument, JobModel } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { QueryJobDto } from './dto/query-job.dto';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(JobModel.name)
        private jobModel: SoftDeleteModel<JobDocument>,
    ) {}

    private async checkJobExists(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Job không hợp lệ`);
        }
        const job = await this.jobModel.findOne({ _id: id });
        if (!job) {
            throw new NotFoundException(`Job không tồn tại`);
        }
    }

    async create(user: IUser, createJobDto: CreateJobDto) {
        const { _id, email } = user;
        const job = await this.jobModel.create({
            ...createJobDto,
            createdBy: { _id, email },
        });
        return {
            _id: job._id,
            createdAt: job.createdAt,
        };
    }

    async findAll(query: QueryJobDto) {
        const {
            current = 1,
            pageSize = 10,
            skills,
            locations,
            levels,
            typeWorks,
            typeContracts,
        } = query;
        const currentPage = Number(current);
        const itemsPerPage = Number(pageSize);
        const skip = (currentPage - 1) * itemsPerPage;

        const condition: Record<string, any> = {};

        if (skills) {
            condition.skills = {
                $in: skills.split(',').map((skill) => skill.trim()),
            };
        }

        if (locations) {
            condition.locations = {
                $in: locations.split(',').map((location) => location.trim()),
            };
        }

        if (levels) {
            condition.levels = {
                $in: levels.split(',').map((level) => level.trim()),
            };
        }

        if (typeWorks) {
            condition.typeWorks = {
                $in: typeWorks.split(',').map((typeWord) => typeWord.trim()),
            };
        }

        if (typeContracts) {
            condition.typeContracts = {
                $in: typeContracts
                    .split(',')
                    .map((typeContract) => typeContract.trim()),
            };
        }

        const [items, total] = await Promise.all([
            this.jobModel
                .find(condition)
                .populate('companyId', '_id name logo')
                .skip(skip)
                .limit(itemsPerPage)
                .lean(),
            this.jobModel.countDocuments(condition),
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
        await this.checkJobExists(id);
        return this.jobModel
            .findById(id)
            .populate('companyId', '_id name logo')
            .lean();
    }

    async findAllByCompany(companyId: string) {
        return this.jobModel
            .find({ companyId })
            .populate('companyId', '_id name logo')
            .lean();
    }

    async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
        await this.checkJobExists(id);
        const { _id, email } = user;
        await this.jobModel.updateOne(
            { _id: id },
            {
                $set: {
                    ...updateJobDto,
                    updatedBy: { _id, email },
                },
            },
        );

        return {
            _id: id,
            updatedAt: new Date(),
        };
    }

    async remove(id: string, user: IUser) {
        await this.checkJobExists(id);
        const { _id, email } = user;
        await this.jobModel.updateOne(
            { _id: id },
            {
                $set: {
                    deletedBy: { _id, email },
                },
            },
        );
        await this.jobModel.softDelete({ _id: id });
    }
}
