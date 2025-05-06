import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ResumeDocument, ResumeModel } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Types } from 'mongoose';
import { IUser } from '@/users/users.interface';

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
        const resume = await this.resumeModel.create({
            ...createResumeDto,
            status: 'PENDING',
            history: [
                {
                    status: 'PENDING',
                    updatedAt: new Date(),
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            ],
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: resume?._id,
            createdAt: resume?.createdAt,
        };
    }

    async findAll(page: number, pageSize: number) {
        const defaultPage = page ? page : 1;
        const defaultPageSize = pageSize ? pageSize : 10;
        const skip = (defaultPage - 1) * defaultPageSize;

        const [items, totalItems] = await Promise.all([
            this.resumeModel.find().skip(skip).limit(defaultPageSize),
            this.resumeModel.countDocuments(),
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
        await this.checkResumeExists(id);
        return await this.resumeModel.findById(id);
    }

    async update(user: IUser, id: string, updateResumeDto: UpdateResumeDto) {
        await this.checkResumeExists(id);
        const resume = await this.resumeModel.findByIdAndUpdate(id, {
            ...updateResumeDto,
            status: 'PENDING',
            history: [
                ...(await this.resumeModel.findById(id)).history,
                {
                    status: 'PENDING',
                    updatedAt: new Date(),
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            ],
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: resume?._id,
            updatedAt: resume?.updatedAt,
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
