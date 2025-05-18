import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('NestJS API')
        .setDescription('API documentation cho ứng dụng NestJS')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'Bearer',
                bearerFormat: 'JWT',
                in: 'header',
            },
            'token',
        )
        .addSecurityRequirements('token')
        .addTag('Auth', 'Các API liên quan đến xác thực')
        .addTag('Users', 'Các API liên quan đến người dùng')
        .addTag('Roles', 'Các API liên quan đến vai trò')
        .addTag('Permissions', 'Các API liên quan đến quyền hạn')
        .addTag('Companies', 'Các API liên quan đến công ty')
        .addTag('Jobs', 'Các API liên quan đến công việc')
        .addTag('Files', 'Các API liên quan đến tập tin')
        .addTag('Mail', 'Các API liên quan đến email')
        .addTag('Health', 'Các API liên quan đến tình trạng hệ thống')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
}
