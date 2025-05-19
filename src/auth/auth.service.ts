import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { TokenPayload } from '@/types'
import { IUser } from '@/users/users.interface'
import { UsersService } from '@/users/users.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { RolesService } from '@/roles/roles.service'

@Injectable()
export class AuthService {
    constructor(
        private roleService: RolesService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(username: string, pass: string) {
        try {
            const user = await this.usersService.findByEmail(username)
            if (!user) return null

            const isValid = this.usersService.checkPassword(pass, user.password)
            if (!isValid) return null

            const { password, ...result } = user
            return result
        } catch {
            return null
        }
    }

    private generateAccessToken(user: IUser) {
        const { _id, name, email, role } = user
        return this.jwtService.sign({
            sub: 'access token',
            iss: 'from server',
            _id,
            name,
            email,
            role,
        })
    }

    private generateRefreshToken(user: IUser) {
        const { _id, name, email, role } = user
        const payload = {
            sub: 'refresh token',
            iss: 'from server',
            _id,
            name,
            email,
            role,
        }
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
        })
    }

    private async generateTokens(user: IUser, response: Response) {
        const { _id, email, name, role } = user
        const roleId = (role as any)._id as string

        const [access_token, refresh_token, permissions] = await Promise.all([
            this.generateAccessToken(user),
            this.generateRefreshToken(user),
            this.roleService.findOne(roleId).then((role) => role.permissions),
        ])

        await this.usersService.updateTokenUser(_id, refresh_token)

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 ngày
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        })

        return {
            access_token,
            user: { _id, email, name, role, permissions },
        }
    }

    async login(user: IUser, response: Response) {
        return this.generateTokens(user, response)
    }

    async register(body: CreateUserDto, response: Response) {
        const newUser = await this.usersService.create(body)
        return this.generateTokens(newUser, response)
    }

    async refreshToken(refreshToken: string, response: Response) {
        try {
            const decoded: TokenPayload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            })

            const tokenExists = await this.usersService.findUserByToken(refreshToken)
            if (!tokenExists) {
                throw new UnauthorizedException('Refresh token không hợp lệ')
            }

            return this.generateTokens(
                {
                    _id: decoded._id,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role,
                },
                response,
            )
        } catch (error) {
            throw error instanceof UnauthorizedException
                ? error
                : new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn')
        }
    }

    async logout(user: IUser, response: Response) {
        response.clearCookie('refresh_token')
        await this.usersService.logout(user._id)
    }
}
