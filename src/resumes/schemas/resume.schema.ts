import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ResumeDocument = HydratedDocument<ResumeModel>;

@Schema({
    timestamps: true,
    collection: 'resumes',
})
export class ResumeModel {
    @Prop()
    email: string;

    @Prop()
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    status: string;

    @Prop()
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop()
    jobId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Array })
    history: [
        {
            status: string;
            updatedAt: Date;
            updatedBy: {
                _id: mongoose.Schema.Types.ObjectId;
                name: string;
            };
        },
    ];

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(ResumeModel);
