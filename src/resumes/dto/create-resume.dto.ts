import mongoose from 'mongoose'
import { IsMongoId, IsNotEmpty } from 'class-validator'

export class CreateResumeDto {
    @IsNotEmpty({ message: 'URL không được để trống' })
    url: string

    @IsNotEmpty({ message: 'CompanyId không được để trống' })
    @IsMongoId({ message: 'CompanyId không hợp lệ' })
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({ message: 'JobId không được để trống' })
    @IsMongoId({ message: 'JobId không hợp lệ' })
    jobId: mongoose.Schema.Types.ObjectId
}
