import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({
    timestamps: true,
})
export class Company {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    description: string;

    @Prop({ type: { _id: String, email: String } })
    createdBy: {
        _id: string;
        email: string;
    };

    @Prop({ type: { _id: String, email: String } })
    updatedBy: {
        _id: string;
        email: string;
    };

    @Prop({ type: { _id: String, email: String } })
    deletedBy: {
        _id: string;
        email: string;
    };

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
