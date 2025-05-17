import { IS_PUBLIC_KEY } from '@/decorator/customize.decorator';
import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Kiểm tra xem route có được đánh dấu là public không
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Nếu route là public, cho phép truy cập
        if (isPublic) {
            return true;
        }

        // Nếu không phải public, kiểm tra JWT
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        ('handleRequest');
        const req: Request = context.switchToHttp().getRequest();
        // Kiểm tra cả err và info để xử lý lỗi
        if (err || info) {
            const error = err || info;

            if (error?.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Token không hợp lệ');
            }
            if (error?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token đã hết hạn');
            }
            if (error?.message === 'jwt malformed') {
                throw new UnauthorizedException('Token không đúng định dạng');
            }

            throw new UnauthorizedException('Không có quyền truy cập');
        }

        // Kiểm tra user tồn tại
        if (!user) {
            throw new UnauthorizedException('Người dùng không tồn tại');
        }

        // Kiểm tra permissions
        const targetMethod = req.method;
        const targetEndpoint = req.route.path;
        const permissions = user?.permissions || [];
        const isAllowed = permissions.some((permission) => {
            return (
                permission.method === targetMethod &&
                permission.apiPath === targetEndpoint
            );
        });
        if (!isAllowed) {
            throw new ForbiddenException(
                'Bạn không có quyền truy cập chức năng này',
            );
        }

        return user;
    }
}
