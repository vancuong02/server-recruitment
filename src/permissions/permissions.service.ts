import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from '@/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
    PermissionDocument,
    PermissionModel,
} from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Types } from 'mongoose';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectModel(PermissionModel.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,
    ) {}

    private async checkExistsApiPathAndMethod(apiPath, method) {
        const foundPermission = await this.permissionModel.findOne({
            apiPath,
            method,
        });
        if (foundPermission) {
            throw new BadRequestException(
                `Quyền với apiPath ${apiPath} và phương thức ${method} đã tồn tại`,
            );
        }
    }

    private async checkExistsPermission(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Quyền với id ${id} không hợp lệ`);
        }
        const foundPermission = await this.permissionModel.findOne({ _id: id });
        if (!foundPermission) {
            throw new BadRequestException(`Quyền với id ${id} không tồn tại`);
        }
    }

    async create(user: IUser, createPermissionDto: CreatePermissionDto) {
        await this.checkExistsApiPathAndMethod(
            createPermissionDto.apiPath,
            createPermissionDto.method,
        );
        const createdPermission = await this.permissionModel.create({
            ...createPermissionDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: createdPermission._id,
            createdAt: createdPermission.createdAt,
        };
    }

    async findAll(page: number, pageSize: number) {
        const defaultPage = page ? page : 1;
        const defaultPageSize = pageSize ? pageSize : 10;
        const skip = (defaultPage - 1) * defaultPageSize;

        const [items, totalItems] = await Promise.all([
            this.permissionModel.find().skip(skip).limit(defaultPageSize),
            this.permissionModel.countDocuments(),
        ]);

        return {
            meta: {
                current: defaultPage,
                pageSize: defaultPageSize,
                totalPages: Math.ceil(totalItems / defaultPageSize),
                totalItems,
            },
            result: items,
        };
    }

    async findOne(id: string) {
        await this.checkExistsPermission(id);
        return this.permissionModel.findById(id);
    }

    async update(
        user: IUser,
        id: string,
        updatePermissionDto: UpdatePermissionDto,
    ) {
        await this.checkExistsPermission(id);

        // Chỉ check apiPath và method nếu có thay đổi
        if (updatePermissionDto.apiPath && updatePermissionDto.method) {
            const existingPermission = await this.permissionModel.findById(id);
            if (
                existingPermission.apiPath !== updatePermissionDto.apiPath ||
                existingPermission.method !== updatePermissionDto.method
            ) {
                await this.checkExistsApiPathAndMethod(
                    updatePermissionDto.apiPath,
                    updatePermissionDto.method,
                );
            }
        }

        await this.permissionModel.updateOne(
            { _id: id },
            {
                ...updatePermissionDto,
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

    async remove(user: IUser, id: string) {
        await this.checkExistsPermission(id);
        await this.permissionModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
        return this.permissionModel.softDelete({ _id: id });
    }
}
