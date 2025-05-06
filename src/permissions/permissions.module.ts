import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionModel, PermissionSchema } from './schemas/permission.schema';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';

@Module({
    controllers: [PermissionsController],
    providers: [PermissionsService],
    imports: [
        MongooseModule.forFeature([
            {
                name: PermissionModel.name,
                schema: PermissionSchema,
            },
        ]),
    ],
})
export class PermissionsModule {}
