import { Get, Post, Body, Patch, Delete, Controller } from '@nestjs/common';
import { IUser } from '@/users/users.interface';
import { User } from '@/decorator/user.decorator';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';

@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly subscribersService: SubscribersService) {}

    @Post()
    create(
        @User() user: IUser,
        @Body() createSubscriberDto: CreateSubscriberDto,
    ) {
        return this.subscribersService.create(user, createSubscriberDto);
    }

    @Get()
    findAll() {
        return this.subscribersService.findAll();
    }

    @Get('/skills')
    findOne(@User() user: IUser) {
        return this.subscribersService.findOne(user.email);
    }

    @Patch()
    update(
        @User() user: IUser,
        @Body() updateSubscriberDto: UpdateSubscriberDto,
    ) {
        return this.subscribersService.update(user, updateSubscriberDto);
    }

    @Delete()
    remove(@User() user: IUser) {
        return this.subscribersService.remove(user);
    }
}
