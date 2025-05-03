import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
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
}
