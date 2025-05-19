import mongoose from 'mongoose'
import { Transform } from 'class-transformer'
import { IsDate, IsNotEmpty, IsMongoId } from 'class-validator'

export class CreateJobDto {
    @IsNotEmpty({ message: 'Tên công việc không được để trống' })
    name: string

    @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
    skills: string[]

    @IsNotEmpty({ message: 'Địa điểm không được để trống' })
    locations: string[]

    @IsNotEmpty({ message: 'Cấp độ không được để trống' })
    levels: string[]

    @IsNotEmpty({ message: 'Loại hợp đồng không được để trống' })
    typeContracts: string[]

    @IsNotEmpty({ message: 'Loại công việc không được để trống' })
    typeWorks: string[]

    @IsNotEmpty({ message: 'Số lượng không được để trống' })
    quantity: number

    @IsNotEmpty({ message: 'Lương không được để trống' })
    salary: string

    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description: string

    @IsNotEmpty({ message: 'CompanyId không được để trống' })
    @IsMongoId({ message: 'CompanyId không hợp lệ' })
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Ngày bắt đầu không hợp lệ' })
    startDate: Date

    @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Ngày kết thúc không hợp lệ' })
    endDate: Date

    @IsNotEmpty({ message: 'Trạng thái không được để trống' })
    isActive: boolean
}
