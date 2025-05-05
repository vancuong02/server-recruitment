import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

import { IUser } from './users.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User as UserModel, UserDocument } from './schemas/user.schema';
import { AdminCreateUserDto, CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: SoftDeleteModel<UserDocument>,
    ) {}

    private async checkUserExists(id: string, hiddenPassword?: boolean) {
        const user = await this.userModel.findById(id, {
            password: hiddenPassword ? 0 : 1,
        });
        if (!user) {
            throw new NotFoundException(
                'Người dùng không tồn tại trong hệ thống',
            );
        } else {
            return user;
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
        const newUser = new this.userModel(userData);
        await newUser.save();

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
        const newUser = new this.userModel(userData);
        await newUser.save();

        return {
            _id: newUser._id,
            createdAt: newUser.createdAt,
        };
    }

    async updateProfile(id: string, updateUserDto: UpdateUserDto, user: IUser) {
        await this.checkUserExists(id);
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            {
                ...updateUserDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
            { new: true },
        );

        return {
            _id: updatedUser._id,
            updatedAt: updatedUser.updatedAt,
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
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            {
                ...updateUserDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
            { new: true },
        );

        return {
            _id: updatedUser._id,
            updatedAt: updatedUser.updatedAt,
        };
    }

    async remove(id: string, user: IUser) {
        await this.checkUserExists(id);

        await this.userModel.findByIdAndUpdate(
            id,
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
            { new: true },
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
        return await this.checkUserExists(id, true);
    }

    checkPassword(plain: string, hash: string) {
        return compareSync(plain, hash);
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.checkUserExists(id);
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
}
