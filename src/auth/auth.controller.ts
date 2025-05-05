import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage('Đăng nhập thành công')
    @Post('/login')
    async handleLogin(@Request() req) {
        return await this.authService.login(req.user['_doc']);
    }
}
