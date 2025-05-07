import {
    IsDate,
    IsNotEmpty,
    IsObject,
    ValidateNested,
    IsNotEmptyObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CompanyDto } from '@/users/dto/create-user.dto';

export class CreateJobDto {
    @IsNotEmpty({ message: 'Tên công việc không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => CompanyDto)
    company: CompanyDto;

    @IsNotEmpty({ message: 'Địa điểm không được để trống' })
    location: string;

    @IsNotEmpty({ message: 'Lương không được để trống' })
    salary: string;

    @IsNotEmpty({ message: 'Số lượng không được để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'Cấp độ không được để trống' })
    level: string;

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Ngày bắt đầu không hợp lệ' })
    startDate: Date;

    @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Ngày kết thúc không hợp lệ' })
    endDate: Date;

    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    isActive: boolean;
}
