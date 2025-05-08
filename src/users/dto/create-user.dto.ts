import {
    IsIn,
    IsEmail,
    MinLength,
    IsNotEmpty,
    IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CompanyDto {
    @IsNotEmpty({ message: 'ID công ty không được để trống' })
    @IsMongoId({ message: 'ID công ty phải là ObjectId' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    name: string;

    logo: string;
}

export class CreateUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: number;

    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    @IsIn(['MALE', 'FEMALE', 'OTHER'], { message: 'Giới tính không hợp lệ' })
    gender: string;

    @IsNotEmpty({ message: 'Vai trò không được để trống' })
    @IsMongoId({ message: 'Vai trò phải là ObjectId' })
    role: mongoose.Schema.Types.ObjectId;
}

export class AdminCreateUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: number;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    @IsIn(['MALE', 'FEMALE', 'OTHER'], { message: 'Giới tính không hợp lệ' })
    gender: string;

    @IsNotEmpty({ message: 'Vai trò không được để trống' })
    @IsMongoId({ message: 'Vai trò phải là ObjectId' })
    role: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Company không được để trống' })
    @IsMongoId({ message: 'Company phải là ObjectId' })
    companyId: mongoose.Schema.Types.ObjectId;
}
