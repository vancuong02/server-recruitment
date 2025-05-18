import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { BadGatewayException, Injectable } from '@nestjs/common';

import {
    SubscriberModel,
    SubscriberDocument,
} from './schemas/subscriber.schema';
import { IUser } from '@/users/users.interface';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';

@Injectable()
export class SubscribersService {
    constructor(
        @InjectModel(SubscriberModel.name)
        private subcriberModel: SoftDeleteModel<SubscriberDocument>,
    ) {}

    async create(user: IUser, createSubscriberDto: CreateSubscriberDto) {
        const { email } = createSubscriberDto;

        const checkExistEmail = await this.subcriberModel.findOne({
            email: createSubscriberDto.email,
        });
        if (checkExistEmail) {
            throw new BadGatewayException(
                `Email: ${email} đã tồn tại trong hệ thống`,
            );
        }

        const newSubscriber = await this.subcriberModel.create({
            ...createSubscriberDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
        return {
            _id: newSubscriber?._id,
            createdAt: new Date(),
        };
    }

    async findAll() {
        return await this.subcriberModel.find().lean();
    }

    async findSkills(email: string) {
        return this.subcriberModel.findOne({ email });
    }

    async update(user: IUser, updateSubscriberDto: UpdateSubscriberDto) {
        const { _id, email } = user;
        await this.subcriberModel.updateOne(
            { email },
            {
                ...updateSubscriberDto,
                updatedBy: {
                    _id,
                    email,
                },
            },
        );

        return {
            email,
            updatedAt: new Date(),
        };
    }

    async remove(user: IUser) {
        const { _id, email } = user;
        await this.subcriberModel.updateOne(
            { email },
            {
                deletedBy: {
                    _id,
                    email,
                },
            },
        );
        await this.subcriberModel.softDelete({ email });

        return {
            email,
            deletedAt: new Date(),
        };
    }
}
