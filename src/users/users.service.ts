import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

import { IUser } from './users.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserModel, UserDocument } from './schemas/user.schema';
import { AdminCreateUserDto, CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: SoftDeleteModel<UserDocument>,
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
        const hashPassword = this.hashPassword(createUserDto.password);
        const userData = {
            ...createUserDto,
            role: 'user',
            password: hashPassword,
        };
        const newUser = await this.userModel.create(userData);

        return {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        };
    }

    async adminCreateUser(createUserDto: AdminCreateUserDto, user: IUser) {
        await this.checkEmailExists(createUserDto.email);
        const hashPassword = this.hashPassword(createUserDto.password);
        const userData = {
            ...createUserDto,
            password: hashPassword,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        };
        const newUser = await this.userModel.create(userData);

        return {
            _id: newUser._id,
            createdAt: newUser.createdAt,
        };
    }

    async updateProfile(id: string, updateUserDto: UpdateUserDto, user: IUser) {
        await this.checkUserExists(id);
        await this.userModel.updateOne(
            { _id: id },
            {
                ...updateUserDto,
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

    async adminUpdate(
        id: string,
        updateUserDto: AdminUpdateUserDto,
        user: IUser,
    ) {
        await this.checkUserExists(id);
        if (updateUserDto.email) {
            await this.checkEmailExists(updateUserDto.email, id);
        }
        await this.userModel.updateOne(
            { _id: id },
            {
                ...updateUserDto,
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
        await this.checkUserExists(id);

        await this.userModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );

        await this.userModel.softDelete({ _id: id });
    }

    async findAll(page: number, pageSize: number) {
        const defaultPage = page ? page : 1;
        const defaultPageSize = pageSize ? pageSize : 10;
        const skip = (defaultPage - 1) * defaultPageSize;

        const [items, totalItems] = await Promise.all([
            this.userModel
                .find({}, { password: 0 })
                .skip(skip)
                .limit(defaultPageSize),
            this.userModel.countDocuments(),
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

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new NotFoundException(
                'Người dùng không tồn tại trong hệ thống',
            );
        }
        return user;
    }

    async findById(id: string) {
        await this.checkUserExists(id);
        return await this.userModel.findById(id, {
            password: 0,
        });
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Id người dùng không hợp lệ');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException(
                'Người dùng không tồn tại trong hệ thống',
            );
        }

        const isValidPassword = compareSync(
            changePasswordDto.currentPassword,
            user.password,
        );
        if (!isValidPassword) {
            throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
        }
        const hashPassword = this.hashPassword(changePasswordDto.newPassword);
        user.password = hashPassword;
        await user.save();
    }

    async updateTokenUser(_id: Types.ObjectId, refreshToken: string) {
        return await this.userModel.updateOne({ _id }, { refreshToken });
    }

    async findUserByToken(refreshToken: string) {
        return await this.userModel.findOne({ refreshToken });
    }

    async logout(_id: Types.ObjectId) {
        return await this.userModel.updateOne({ _id }, { refreshToken: null });
    }
}
