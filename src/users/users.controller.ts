import {
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Controller,
    Query,
} from '@nestjs/common';
import { IUser } from './users.interface';
import { UsersService } from './users.service';
import { User } from '@/decorator/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Get('profile')
    getProfile(@User() user: IUser) {
        return user;
    }

    @Get()
    findAll(
        @Query('current') current: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.usersService.findAll(+current, +pageSize);
    }

    @Get(':email')
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @Patch('change-password/:id')
    changePassword(
        @Param('id') id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.usersService.changePassword(id, changePasswordDto);
    }
}
