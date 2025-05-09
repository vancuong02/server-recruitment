import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';

import {
    PermissionModel,
    PermissionDocument,
} from './schemas/permission.schema';
import { IUser } from '@/users/users.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectModel(PermissionModel.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,
    ) {}

    private async checkExistsApiPathAndMethod(apiPath: string, method: string) {
        const foundPermission = await this.permissionModel
            .findOne({
                apiPath,
                method,
            })
            .select('_id')
            .lean();

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
        const { apiPath, method } = createPermissionDto;
        const { _id, email } = user;
        await this.checkExistsApiPathAndMethod(apiPath, method);

        const createdPermission = await this.permissionModel.create({
            ...createPermissionDto,
            createdBy: { _id, email },
        });

        return {
            _id: createdPermission._id,
            createdAt: createdPermission.createdAt,
        };
    }

    async findAll(page = 1, pageSize = 10) {
        const currentPage = Number(page);
        const itemsPerPage = Number(pageSize);
        const skip = (currentPage - 1) * itemsPerPage;

        const [items, total] = await Promise.all([
            this.permissionModel.find().skip(skip).limit(itemsPerPage).lean(),
            this.permissionModel.countDocuments(),
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
        await this.checkExistsPermission(id);
        return this.permissionModel.findById(id).lean();
    }

    async update(
        user: IUser,
        id: string,
        updatePermissionDto: UpdatePermissionDto,
    ) {
        await this.checkExistsPermission(id);
        const { _id, email } = user;
        const { apiPath, method } = updatePermissionDto;

        // Chỉ check apiPath và method nếu có thay đổi
        if (apiPath && method) {
            const existingPermission = await this.permissionModel
                .findById(id)
                .select('apiPath method')
                .lean();

            if (
                existingPermission.apiPath !== apiPath ||
                existingPermission.method !== method
            ) {
                await this.checkExistsApiPathAndMethod(apiPath, method);
            }
        }

        await this.permissionModel.updateOne(
            { _id: id },
            {
                $set: {
                    ...updatePermissionDto,
                    updatedBy: { _id, email },
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
        const { _id, email } = user;
        await this.permissionModel.updateOne(
            { _id: id },
            {
                $set: {
                    deletedBy: { _id, email },
                },
            },
        );
        return this.permissionModel.softDelete({ _id: id });
    }
}
