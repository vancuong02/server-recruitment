import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { CompanyModel } from '@/companies/schemas/company.schema'

export type JobDocument = HydratedDocument<JobModel>

@Schema({
    timestamps: true,
    collection: 'jobs',
})
export class JobModel {
    @Prop()
    name: string

    @Prop()
    skills: string[]

    @Prop()
    locations: string[]

    @Prop()
    levels: string[]

    @Prop()
    typeContracts: string[]

    @Prop()
    typeWorks: string[]

    @Prop()
    salary: string

    @Prop()
    quantity: number

    @Prop()
    description: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CompanyModel.name })
    companyId: mongoose.Schema.Types.ObjectId

    @Prop()
    startDate: Date

    @Prop()
    endDate: Date

    @Prop()
    isActive: boolean

    @Prop()
    isDeleted: boolean

    @Prop()
    deletedAt: Date

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId
        email: string
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId
        email: string
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId
        email: string
    }

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const JobSchema = SchemaFactory.createForClass(JobModel)
