import ms from 'ms';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/users/users.interface';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        try {
            const user = await this.usersService.findByEmail(username);

            if (!user) {
                return null;
            }

            const isValidPassword = this.usersService.checkPassword(
                pass,
                user.password,
            );
            if (!isValidPassword) return null;

            const { password, ...result } = user;
            return result;
        } catch (error) {
            return null;
        }
    }

    private generateAccessToken(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: 'access token',
            iss: 'from server',
            _id,
            name,
            email,
            role,
        };
        return this.jwtService.sign(payload);
    }

    private generateRefreshToken(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: 'refresh token',
            iss: 'from server',
            _id,
            name,
            email,
            role,
        };
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn:
                ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) /
                1000,
        });
    }

    private async generateTokens(user: IUser, response: Response) {
        const { _id, email, name, role } = user;
        const access_token = this.generateAccessToken(user);
        const refresh_token = this.generateRefreshToken(user);

        await this.usersService.updateTokenUser(_id, refresh_token);
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(
                this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
            ),
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        return {
            access_token,
            refresh_token,
            user: {
                _id,
                email,
                name,
                role,
            },
        };
    }

    async login(user: IUser, response: Response) {
        return this.generateTokens(user, response);
    }

    async register(body: CreateUserDto, response: Response) {
        const newUser = await this.usersService.create(body);
        return this.generateTokens(newUser, response);
    }

    async logout(user: IUser, response: Response) {
        response.clearCookie('refresh_token');
        await this.usersService.logout(user._id);
    }
}
