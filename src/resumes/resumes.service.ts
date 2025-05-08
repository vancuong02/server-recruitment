import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '@/users/users.interface';
import { CreateResumeDto } from './dto/create-resume.dto';
import { ResumeDocument, ResumeModel } from './schemas/resume.schema';

@Injectable()
export class ResumesService {
    constructor(
        @InjectModel(ResumeModel.name)
        private resumeModel: SoftDeleteModel<ResumeDocument>,
    ) {}

    private async checkResumeExists(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Resume không hợp lệ`);
        }
        const resume = await this.resumeModel.findOne({ _id: id });
        if (!resume) {
            throw new NotFoundException(`Resume không tồn tại`);
        }
    }

    async create(user: IUser, createResumeDto: CreateResumeDto) {
        const { email, _id } = user;

        await this.resumeModel.create({
            ...createResumeDto,
            email,
            userId: _id,
            status: 'PENDING',
            history: [
                {
                    status: 'PENDING',
                    updatedAt: new Date(),
                    updatedBy: {
                        _id,
                        email,
                    },
                },
            ],
            createdBy: {
                _id,
                email,
            },
        });

        return {
            _id: _id,
            createdAt: new Date(),
        };
    }

    async findAll(page: number, pageSize: number) {
        const defaultPage = page ? page : 1;
        const defaultPageSize = pageSize ? pageSize : 10;
        const skip = (defaultPage - 1) * defaultPageSize;

        const [items, total] = await Promise.all([
            this.resumeModel
                .find()
                .populate('companyId', '_id name logo')
                .populate('jobId', '_id name')
                .skip(skip)
                .limit(defaultPageSize)
                .sort({ createdAt: -1 }),
            this.resumeModel.countDocuments(),
        ]);

        return {
            meta: {
                current: defaultPage,
                pageSize: defaultPageSize,
                pages: Math.ceil(total / defaultPageSize),
                total,
            },
            result: items,
        };
    }

    async findOne(id: string) {
        await this.checkResumeExists(id);
        return await this.resumeModel
            .findById(id)
            .populate('companyId', '_id name logo')
            .populate('jobId', '_id name')
            .sort({ createdAt: -1 });
    }

    async findByUser(user: IUser) {
        const { _id } = user;
        return await this.resumeModel
            .find({ userId: _id })
            .populate('companyId', 'name')
            .populate('jobId', 'name')
            .sort({ createdAt: -1 });
    }

    async update(user: IUser, id: string, status: string) {
        const { email, _id } = user;
        await this.checkResumeExists(id);
        await this.resumeModel.updateOne(
            { _id: id },
            {
                status,
                updatedBy: {
                    _id,
                    email,
                },
                $push: {
                    history: {
                        status,
                        updatedAt: new Date(),
                        updatedBy: {
                            _id,
                            email,
                        },
                    },
                },
            },
        );

        return {
            _id: id,
            updatedAt: new Date(),
        };
    }

    async remove(user: IUser, id: string) {
        await this.checkResumeExists(id);
        await this.resumeModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
        await this.resumeModel.softDelete({ _id: id });
    }
}
