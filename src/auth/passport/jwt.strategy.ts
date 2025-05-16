import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { IUser } from '@/users/users.interface';
import { RolesService } from '@/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private rolesService: RolesService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: IUser) {
        const { _id, name, email, role } = payload;
        const roleId = (role as any)._id as string;

        const permissions = await this.rolesService
            .findOne(roleId)
            .then((role) => role.permissions);

        return {
            _id,
            name,
            email,
            role,
            permissions,
        };
    }
}
