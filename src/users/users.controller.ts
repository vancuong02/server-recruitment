import {
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    Delete,
    Controller,
} from '@nestjs/common';
import { IUser } from './users.interface';
import { UsersService } from './users.service';
import { User } from '@/decorator/user.decorator';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ResponseMessage('Tạo người dùng thành công')
    create(@Body() createUserDto: AdminCreateUserDto, @User() user: IUser) {
        return this.usersService.adminCreateUser(createUserDto, user);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật người dùng thành công')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: AdminUpdateUserDto,
        @User() user: IUser,
    ) {
        return this.usersService.adminUpdate(id, updateUserDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Xóa người dùng thành công')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.usersService.remove(id, user);
    }

    @Patch('profile')
    updateProfile(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @User() user: IUser,
    ) {
        return this.usersService.updateProfile(id, updateUserDto, user);
    }

    @Get()
    @ResponseMessage('Lấy danh sách người dùng thành công')
    findAll(
        @Query('current') page: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.usersService.findAll(+page, +pageSize);
    }

    @Get('by-email/:email')
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Patch('change-password/:id')
    @ResponseMessage('Đổi mật khẩu thành công')
    changePassword(
        @Param('id') id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.usersService.changePassword(id, changePasswordDto);
    }
}
