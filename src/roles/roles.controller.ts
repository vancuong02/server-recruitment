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
import { ResponseMessage } from '@/decorator/customize.decorator';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    @ResponseMessage('Tạo mới role thành công')
    create(@User() user: IUser, @Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(user, createRoleDto);
    }

    @Get()
    @ResponseMessage('Lấy danh sách role thành công')
    findAll(
        @Query('current') page: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.rolesService.findAll(+page, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật role thành công')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.rolesService.update(user, id, updateRoleDto);
    }

    @Delete(':id')
    @ResponseMessage('Xóa role thành công')
    remove(@User() user: IUser, @Param('id') id: string) {
        return this.rolesService.remove(user, id);
    }
}
