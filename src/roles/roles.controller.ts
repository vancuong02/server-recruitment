import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from '@/users/users.interface';
import { User } from '@/decorator/user.decorator';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    create(@User() user: IUser, @Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(user, createRoleDto);
    }

    @Get()
    findAll(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        return this.rolesService.findAll(+page, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.rolesService.update(user, id, updateRoleDto);
    }

    @Delete(':id')
    remove(@User() user: IUser, @Param('id') id: string) {
        return this.rolesService.remove(user, id);
    }
}
