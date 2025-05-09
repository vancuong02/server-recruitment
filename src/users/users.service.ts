import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

import { Roles } from '@/types';
import { IUser } from './users.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserModel, UserDocument } from './schemas/user.schema';
import { RoleDocument, RoleModel } from '@/roles/schemas/role.schema';
import { AdminCreateUserDto, CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(RoleModel.name)
        private roleModel: SoftDeleteModel<RoleDocument>,
    ) {}

    checkPassword(plain: string, hash: string) {
        return compareSync(plain, hash);
    }

    private async checkUserExists(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Id người dùng không hợp lệ');
        }
        const user = await this.userModel.findOne({ _id: id });
        if (!user) {
            throw new NotFoundException(
                'Người dùng không tồn tại trong hệ thống',
            );
        }
    }

    private async checkEmailExists(email: string, excludeUserId?: string) {
        const query = {
            email,
            ...(excludeUserId && { _id: { $ne: excludeUserId } }),
        };
        const existingUser = await this.userModel.findOne(query);
        if (existingUser) {
            throw new BadRequestException('Email đã tồn tại trong hệ thống');
        }
    }

    private hashPassword(password: string) {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }

    async create(createUserDto: CreateUserDto) {
        await this.checkEmailExists(createUserDto.email);
        const ROLE_USER = Roles.NOMAL_USER;

        const [newUser, role] = await Promise.all([
            this.userModel.create({
                ...createUserDto,
                role: ROLE_USER,
                password: this.hashPassword(createUserDto.password),
            }),
            this.roleModel.findOne({ name: ROLE_USER }).select('_id'),
        ]);

        return {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: role._id,
        };
    }

    async adminCreateUser(createUserDto: AdminCreateUserDto, user: IUser) {
        await this.checkEmailExists(createUserDto.email);

        const { _id, email } = user;
        const newUser = await this.userModel.create({
            ...createUserDto,
            password: this.hashPassword(createUserDto.password),
            createdBy: { _id, email },
        });

        return {
            _id: newUser._id,
            createdAt: newUser.createdAt,
        };
    }

    async updateProfile(updateUserDto: UpdateUserDto, user: IUser) {
        const { _id, email } = user;
        await this.checkUserExists(_id.toString());

        const userUpdated = await this.userModel
            .findByIdAndUpdate(
                _id,
                {
                    $set: {
                        ...updateUserDto,
                        updatedBy: { _id, email },
                    },
                },
                { new: true },
            )
            .select('name');

        return { name: userUpdated.name };
    }

    async adminUpdate(
        id: string,
        updateUserDto: AdminUpdateUserDto,
        user: IUser,
    ) {
        await this.checkUserExists(id);
        if (updateUserDto.email) {
            await this.checkEmailExists(updateUserDto.email, id);
        }

        const { _id, email } = user;
        await this.userModel.updateOne(
            { _id: id },
            {
                $set: {
                    ...updateUserDto,
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
        await this.checkUserExists(id);
        const userToDelete = await this.userModel
            .findById(id)
            .populate('role', 'name')
            .select('role');
        if ((userToDelete?.role as any).name === Roles.SUPE_ADMIN) {
            throw new BadRequestException(
                `Không thể xóa tài khoản có role ${Roles.SUPE_ADMIN}`,
            );
        }

        await this.userModel.updateOne(
            { _id: id },
            {
                $set: {
                    deletedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            },
        );

        await this.userModel.softDelete({ _id: id });
    }

    async findAll(page: number, pageSize: number) {
        const defaultPage = page ? Number(page) : 1;
        const defaultPageSize = pageSize ? Number(pageSize) : 10;
        const skip = (defaultPage - 1) * defaultPageSize;

        const [items, total] = await Promise.all([
            this.userModel
                .find()
                .select('-password')
                .populate([
                    { path: 'role', select: '_id name' },
                    { path: 'companyId', select: '_id name logo' },
                ])
                .skip(skip)
                .limit(defaultPageSize),
            this.userModel.countDocuments(),
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

    async findByEmail(email: string) {
        const user = await this.userModel
            .findOne({ email })
            .populate('role', '_id name');
        if (!user) {
            throw new NotFoundException(
                'Người dùng không tồn tại trong hệ thống',
            );
        }
        return user;
    }

    async findById(id: string) {
        await this.checkUserExists(id);
        return await this.userModel
            .findById(id)
            .select('-password')
            .populate([
                { path: 'role', select: '_id name' },
                { path: 'companyId', select: '_id name logo' },
            ])
            .lean();
    }

    async changePassword(
        id: Types.ObjectId,
        changePasswordDto: ChangePasswordDto,
    ) {
        const user = await this.userModel
            .findById(id)
            .select('password')
            .lean();
        if (!user) {
            throw new NotFoundException(
                'Người dùng không tồn tại trong hệ thống',
            );
        }

        if (!compareSync(changePasswordDto.currentPassword, user.password)) {
            throw new BadRequestException('Mật khẩu hiện tại không đúng');
        }

        await this.userModel.updateOne(
            { _id: id },
            {
                $set: {
                    password: this.hashPassword(changePasswordDto.newPassword),
                },
            },
        );
    }

    async updateTokenUser(_id: Types.ObjectId, refreshToken: string) {
        return await this.userModel.updateOne({ _id }, { refreshToken });
    }

    async findUserByToken(refreshToken: string) {
        return await this.userModel
            .findOne({ refreshToken })
            .populate('role', 'name');
    }

    async logout(_id: Types.ObjectId) {
        return await this.userModel.updateOne({ _id }, { refreshToken: null });
    }
}
