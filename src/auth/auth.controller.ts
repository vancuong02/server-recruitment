import { Request, Response } from 'express';
import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { IUser } from '@/users/users.interface';
import { User } from '@/decorator/user.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Public, ResponseMessage } from '@/decorator/customize.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage('Đăng nhập thành công')
    @Post('login')
    async handleLogin(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        return await this.authService.login(req.user['_doc'], response);
    }

    @Public()
    @Post('register')
    @ResponseMessage('Đăng ký thành công')
    async handleRegister(
        @Body() body: CreateUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        return await this.authService.register(body, response);
    }

    @Public()
    @Get('refresh-token')
    @ResponseMessage('Lấy accessToken mới thành công')
    handleRefreshToken(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.refreshToken(refreshToken, response);
    }

    @Post('logout')
    @ResponseMessage('Đăng xuất thành công')
    async handleLogout(
        @User() user: IUser,
        @Res({ passthrough: true }) response: Response,
    ) {
        return await this.authService.logout(user, response);
    }
}
