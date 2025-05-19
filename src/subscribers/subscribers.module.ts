import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SubscribersService } from './subscribers.service'
import { SubscribersController } from './subscribers.controller'
import { SubscriberModel, SubscriberSchema } from './schemas/subscriber.schema'

@Module({
    controllers: [SubscribersController],
    providers: [SubscribersService],
    imports: [
        MongooseModule.forFeature([
            {
                name: SubscriberModel.name,
                schema: SubscriberSchema,
            },
        ]),
    ],
})
export class SubscribersModule {}
