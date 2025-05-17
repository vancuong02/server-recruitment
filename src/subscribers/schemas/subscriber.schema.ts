import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SubscriberDocument = HydratedDocument<SubscriberModel>;

@Schema({
    timestamps: true,
    collection: 'subcribers',
})
export class SubscriberModel {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    skills: string[];

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}

export const SubscriberSchema = SchemaFactory.createForClass(SubscriberModel);
