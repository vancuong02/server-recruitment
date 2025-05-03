import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MinLength,
} from 'class-validator';

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

    @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
    phone: string;

    @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
    address: string;

    @IsNumber({}, { message: 'Tuổi phải là số' })
    age: number;
}
