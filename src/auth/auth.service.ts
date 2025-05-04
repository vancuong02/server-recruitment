import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);
        if (!user) {
            throw new UnauthorizedException(
                'Email không tồn tại trong hệ thống',
            );
        }

        const isValidPassword = this.usersService.checkPassword(
            pass,
            user.password,
        );
        if (!isValidPassword) {
            throw new UnauthorizedException('Mật khẩu không chính xác');
        }

        const { password, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
