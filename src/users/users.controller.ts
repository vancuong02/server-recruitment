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
import { ApiTags } from '@nestjs/swagger';
import { IUser } from './users.interface';
import { UsersService } from './users.service';
import { User } from '@/decorator/user.decorator';
import { AdminCreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ResponseMessage('Tạo người dùng thành công')
    create(@Body() createUserDto: AdminCreateUserDto, @User() user: IUser) {
        return this.usersService.adminCreateUser(createUserDto, user);
    }

    @Patch('change-password')
    @ResponseMessage('Đổi mật khẩu thành công')
    changePassword(
        @User() user: IUser,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        console.log(user);

        return this.usersService.changePassword(user._id, changePasswordDto);
    }

    @Patch('profile')
    @ResponseMessage('Cập nhật thông tin thành công')
    updateProfile(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
        return this.usersService.updateProfile(updateUserDto, user);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật thông tin người dùng thành công')
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

    @Get()
    @ResponseMessage('Lấy danh sách người dùng thành công')
    findAll(
        @Query('current') page: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.usersService.findAll(+page, +pageSize);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }
}
