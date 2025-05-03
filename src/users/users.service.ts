import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const salt = genSaltSync(10);
        const hashPassword = hashSync(createUserDto.password, salt);

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashPassword,
        });
        await newUser.save();

        const { password, ...user } = newUser.toObject();
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            updateUserDto,
            { new: true },
        );

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        const { password, ...result } = updatedUser.toObject();
        return result;
    }

    async remove(id: string) {
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
        return { message: 'User deleted successfully' };
    }

    async findAll() {
        return await this.userModel.find({});
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    checkPassword(hash: string, plain: string) {
        return compareSync(hash, plain);
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

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

        return { message: 'Password changed successfully' };
    }
}
