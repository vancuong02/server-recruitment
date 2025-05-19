import mongoose, { HydratedDocument } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type PermissionDocument = HydratedDocument<PermissionModel>

@Schema({
    timestamps: true,
    collection: 'permissions',
})
export class PermissionModel {
    @Prop()
    name: string

    @Prop()
    apiPath: string

    @Prop()
    method: string

    @Prop()
    module: string

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

export const PermissionSchema = SchemaFactory.createForClass(PermissionModel)
