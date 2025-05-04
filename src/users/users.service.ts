import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { IUser } from './users.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,
    ) {}

    private async checkUserExists(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
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

    private async hashPassword(password: string) {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }

    async create(createUserDto: CreateUserDto) {
        // Kiểm tra email tồn tại
        await this.checkEmailExists(createUserDto.email);

        const hashPassword = await this.hashPassword(createUserDto.password);
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashPassword,
        });
        await newUser.save();

        // Loại bỏ password khi trả về
        const { password, ...user } = newUser.toObject();
        return {
            message: 'Tạo người dùng thành công',
            data: user,
        };
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        // Kiểm tra user tồn tại
        await this.checkUserExists(id);

        if (updateUserDto.email) {
            await this.checkEmailExists(updateUserDto.email, id);
        }

        // Cập nhật user
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            updateUserDto,
            { new: true },
        );

        // Loại bỏ password khi trả về
        const { password, ...user } = updatedUser.toObject();
        return {
            message: 'Cập nhật người dùng thành công',
            data: user,
        };
    }

    async remove(id: string) {
        const deletedUser = await this.userModel.softDelete({ _id: id });
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
        return { message: 'Xóa người dùng thành công' };
    }

    async findAll(current: number, pageSize: number) {
        const defaultCurrent = current ? current : 1;
        const defaultPageSize = pageSize ? pageSize : 10;
        const skip = (defaultCurrent - 1) * defaultPageSize;

        const [items, totalItems] = await Promise.all([
            this.userModel.find().skip(skip).limit(defaultPageSize),
            this.userModel.countDocuments(),
        ]);

        return {
            message: 'Lấy danh sách người dùng thành công',
            meta: {
                currentPage: defaultCurrent,
                pageSize: defaultPageSize,
                totalPages: Math.ceil(totalItems / defaultPageSize),
                totalItems,
            },
            data: items,
        };
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        return {
            message: 'Lấy thông tin người dùng thành công',
            data: user,
        };
    }

    checkPassword(plain: string, hash: string) {
        return compareSync(plain, hash);
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.checkUserExists(id);

        // Kiểm tra mật khẩu hiện tại
        const isValidPassword = compareSync(
            changePasswordDto.currentPassword,
            user.password,
        );
        if (!isValidPassword) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash mật khẩu mới
        const salt = genSaltSync(10);
        const hashPassword = hashSync(changePasswordDto.newPassword, salt);

        // Cập nhật mật khẩu mới
        user.password = hashPassword;
        await user.save();

        return { message: 'Thay đổi mật khẩu thành công' };
    }
}
