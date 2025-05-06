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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from '@/decorator/user.decorator';
import { IUser } from '@/users/users.interface';
import { ResponseMessage } from '@/decorator/customize.decorator';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post()
    @ResponseMessage('Tạo mới quyền thành công')
    create(
        @User() user: IUser,
        @Body() createPermissionDto: CreatePermissionDto,
    ) {
        return this.permissionsService.create(user, createPermissionDto);
    }

    @Get()
    @ResponseMessage('Lấy danh sách quyền thành công')
    findAll(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        return this.permissionsService.findAll(+page, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật quyền thành công')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() updatePermissionDto: UpdatePermissionDto,
    ) {
        return this.permissionsService.update(user, id, updatePermissionDto);
    }

    @Delete(':id')
    @ResponseMessage('Xóa quyền thành công')
    remove(@User() user: IUser, @Param('id') id: string) {
        return this.permissionsService.remove(user, id);
    }
}
