import mongoose from 'mongoose'
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator'

export class CreateRoleDto {
    // HR, SUPE_ADMIN, NOMAL_USER
    @IsNotEmpty({ message: 'Tên role không được để trống' })
    name: string

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string

    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    isActive: boolean

    @IsNotEmpty({ message: 'Permissions không được để trống' })
    @IsMongoId({ message: 'Permissions phải là ObjectId', each: true })
    @IsArray({ message: 'Permissions phải là mảng' })
    permissions: mongoose.Schema.Types.ObjectId[]
}
