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
        const job = await this.jobModel.create({
            ...createJobDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return {
            _id: job._id,
            createdAt: job.createdAt,
        };
    }

    async findAll(page: number, pageSize: number) {
        const defaultPage = page ? page : 1;
        const defaultPageSize = pageSize ? pageSize : 10;
        const skip = (defaultPage - 1) * defaultPageSize;

        const [items, totalItems] = await Promise.all([
            this.jobModel.find().skip(skip).limit(defaultPageSize),
            this.jobModel.countDocuments(),
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
        await this.checkJobExists(id);
        return await this.jobModel.findById(id);
    }

    async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
        await this.checkJobExists(id);
        await this.jobModel.updateOne(
            { _id: id },
            {
                ...updateJobDto,
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

    async remove(id: string, user: IUser) {
        await this.checkJobExists(id);
        await this.jobModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
        await this.jobModel.softDelete({ _id: id });
    }
}
