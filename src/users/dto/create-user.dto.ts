import {
    IsIn,
    IsEmail,
    IsObject,
    MinLength,
    IsNotEmpty,
    ValidateNested,
    IsNotEmptyObject,
} from 'class-validator';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';

export class CompanyDto {
    @IsNotEmpty({ message: 'ID công ty không được để trống' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    name: string;
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
    @IsIn(['male', 'female', 'other'], { message: 'Giới tính không hợp lệ' })
    gender: string;

    @IsNotEmpty({ message: 'Vai trò không được để trống' })
    role: string;
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
    @IsIn(['male', 'female', 'other'], { message: 'Giới tính không hợp lệ' })
    gender: string;

    @IsNotEmpty({ message: 'Vai trò không được để trống' })
    @IsIn(['admin', 'user', 'hr'], { message: 'Vai trò không hợp lệ' })
    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => CompanyDto)
    company: CompanyDto;
}
