import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel, UserSchema } from './schemas/user.schema';
import { RoleModel, RoleSchema } from '@/roles/schemas/role.schema';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        MongooseModule.forFeature([
            { name: UserModel.name, schema: UserSchema },
            { name: RoleModel.name, schema: RoleSchema },
        ]),
        ConfigModule,
    ],
    exports: [UsersService],
})
export class UsersModule {}
