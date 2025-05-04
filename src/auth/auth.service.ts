import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { IUser } from '@/users/users.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);

        const isValidPassword = this.usersService.checkPassword(
            pass,
            user.password,
        );

        if (isValidPassword) {
            const { password, ...result } = user;
            return result;
        } else {
            return null;
        }
    }

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email,
            role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role,
        };
    }
}
