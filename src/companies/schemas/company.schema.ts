import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type CompanyDocument = HydratedDocument<CompanyModel>

@Schema({
    timestamps: true,
    collection: 'companies',
})
export class CompanyModel {
    @Prop()
    name: string

    @Prop()
    logo: string

    @Prop()
    location: string

    @Prop()
    description: string

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
    isDeleted: boolean

    @Prop()
    deletedAt: Date

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const CompanySchema = SchemaFactory.createForClass(CompanyModel)
