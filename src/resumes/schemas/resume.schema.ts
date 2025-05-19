import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { JobModel } from '@/jobs/schemas/job.schema'
import { CompanyModel } from '@/companies/schemas/company.schema'

export type ResumeDocument = HydratedDocument<ResumeModel>

@Schema({
    timestamps: true,
    collection: 'resumes',
})
export class ResumeModel {
    @Prop()
    email: string

    @Prop()
    userId: mongoose.Schema.Types.ObjectId

    @Prop()
    url: string

    @Prop()
    status: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CompanyModel.name })
    companyId: mongoose.Schema.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: JobModel.name })
    jobId: mongoose.Schema.Types.ObjectId

    @Prop({ type: Array })
    history: [
        {
            status: string
            updatedAt: Date
            updatedBy: {
                _id: mongoose.Schema.Types.ObjectId
                name: string
            }
        },
    ]

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
}

export const ResumeSchema = SchemaFactory.createForClass(ResumeModel)
