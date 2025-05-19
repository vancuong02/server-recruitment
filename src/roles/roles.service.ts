import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'

import { IUser } from '@/users/users.interface'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleDocument, RoleModel } from './schemas/role.schema'
import { Types } from 'mongoose'

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(RoleModel.name)
        private roleModel: SoftDeleteModel<RoleDocument>,
    ) {}

    private async checkExistsRole(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Id role không hợp lệ')
        }
        const role = await this.roleModel.findOne({ _id: id })
        if (!role) {
            throw new BadRequestException('Role không tồn tại')
        }
    }

    private async checkExistsNameRole(name: string) {
        const role = await this.roleModel.findOne({ name })
        if (role) {
            throw new BadRequestException('Tên role đã tồn tại')
        }
    }

    async create(user: IUser, createRoleDto: CreateRoleDto) {
        await this.checkExistsNameRole(createRoleDto.name)
        const createdRole = await this.roleModel.create({
            ...createRoleDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        })
        return {
            _id: createdRole._id,
            createdAt: createdRole.createdAt,
        }
    }

    async findAll(page: number, pageSize: number) {
        const defaultPage = page ? page : 1
        const defaultPageSize = pageSize ? pageSize : 10
        const skip = (defaultPage - 1) * defaultPageSize

        const [items, total] = await Promise.all([
            this.roleModel.find().skip(skip).limit(defaultPageSize),
            this.roleModel.countDocuments(),
        ])

        return {
            meta: {
                current: defaultPage,
                pageSize: defaultPageSize,
                pages: Math.ceil(total / defaultPageSize),
                total,
            },
            result: items,
        }
    }

    async findOne(id: string) {
        await this.checkExistsRole(id)
        return await this.roleModel.findById(id).populate('permissions', '_id apiPath name method module')
    }

    async update(user: IUser, id: string, updateRoleDto: UpdateRoleDto) {
        await this.checkExistsRole(id)
        await this.roleModel.updateOne(
            { _id: id },
            {
                ...updateRoleDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        )
        return {
            _id: id,
            updatedAt: new Date(),
        }
    }

    async remove(user: IUser, id: string) {
        await this.checkExistsRole(id)
        const roleToDelete = await this.roleModel.findById(id)
        if (roleToDelete.name === 'ADMIN') {
            throw new BadRequestException('Role này không thể xóa')
        }
        await this.roleModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        )
        await this.roleModel.softDelete({ _id: id })
    }
}
