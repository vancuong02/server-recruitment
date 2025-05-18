import { ThrottlerException } from '@nestjs/throttler';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    catch(exception: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response.status(429).json({
            statusCode: 429,
            message: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
            error: 'Too Many Requests',
        });
    }
}
