import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
    @IsNotEmpty({ message: 'Tên role không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    isActive: boolean;

    @IsNotEmpty({ message: 'Permissions không được để trống' })
    @IsArray({ message: 'Permissions phải là mảng' })
    permissions: [];
}
