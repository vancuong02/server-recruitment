import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
    name: string;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    @IsString({ message: 'Địa chỉ phải là chuỗi ký tự' })
    address: string;

    @IsOptional()
    @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
    description: string;
}
