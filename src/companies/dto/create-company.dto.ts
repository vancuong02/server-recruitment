import { IsNotEmpty } from 'class-validator'

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    name: string

    @IsNotEmpty({ message: 'Logo không được để trống' })
    logo: string

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    location: string

    description: string
}
