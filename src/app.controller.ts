import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from './decorator/public.decorator';

@Controller()
export class AppController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async handleLogin(@Request() req) {
        return this.authService.login(req.user['_doc']);
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
