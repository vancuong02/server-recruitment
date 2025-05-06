import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleModel, RoleSchema } from './schemas/role.schema';

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
        MongooseModule.forFeature([
            {
                name: RoleModel.name,
                schema: RoleSchema,
            },
        ]),
    ],
})
export class RolesModule {}
