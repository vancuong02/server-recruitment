import { IsIn, IsEmail, MinLength, IsNotEmpty, IsMongoId, IsString } from 'class-validator'
import mongoose from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string

    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: number

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string

    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    @IsIn(['MALE', 'FEMALE', 'OTHER'], { message: 'Giới tính không hợp lệ' })
    gender: string
}

export class AdminCreateUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string

    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: number

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string

    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    @IsIn(['MALE', 'FEMALE', 'OTHER'], { message: 'Giới tính không hợp lệ' })
    gender: string

    @IsNotEmpty({ message: 'Company không được để trống' })
    @IsMongoId({ message: 'Company phải là ObjectId' })
    companyId: mongoose.Schema.Types.ObjectId
}

export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'email@gmail.com', description: 'Tài khoản email' })
    readonly username: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
        description: 'Mật khẩu',
    })
    readonly password: string
}
