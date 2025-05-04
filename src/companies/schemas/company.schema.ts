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

    @Prop({ type: Object })
    createdBy: {
        _id: string;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: string;
        email: string;
    };

    @Prop({ type: Object })
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
