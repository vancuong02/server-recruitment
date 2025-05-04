import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';

class CompanyDto {
    @IsString({ message: 'ID công ty phải là chuỗi ký tự' })
    _id: string;

    @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
    name: string;
}

export class CreateUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @IsString({ message: 'Tên phải là chuỗi ký tự' })
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsOptional()
    @IsNumber({}, { message: 'Tuổi phải là số' })
    age: number;

    @IsOptional()
    @IsString({ message: 'Giới tính phải là chuỗi ký tự' })
    @IsIn(['male', 'female', 'other'], { message: 'Giới tính không hợp lệ' })
    gender: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CompanyDto)
    company?: CompanyDto;

    @IsOptional()
    @IsString({ message: 'Vai trò phải là chuỗi ký tự' })
    @IsIn(['admin', 'user', 'hr'], { message: 'Vai trò không hợp lệ' })
    role = 'user';

    @IsOptional()
    @IsString({ message: 'Refresh token phải là chuỗi ký tự' })
    refreshToken?: string;

    @IsOptional()
    @IsBoolean({ message: 'isDeleted phải là boolean' })
    isDeleted?: boolean;

    @IsOptional()
    @IsDate({ message: 'Ngày xóa phải là kiểu Date' })
    deletedAt?: Date;
}
