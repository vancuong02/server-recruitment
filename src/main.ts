import ms from 'ms';
import {
    ValidationPipe,
    VersioningType,
    BadRequestException,
} from '@nestjs/common';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Config Guard
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    // Config interceptor
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    // Config Validation
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => {
                const result = errors.map((error) => ({
                    property: error.property,
                    message: error.constraints
                        ? Object.values(error.constraints)[0]
                        : 'Lỗi validation',
                }));
                return new BadRequestException(result);
            },
        }),
    );

    const configService = app.get(ConfigService);
    const port = configService.get<string>('PORT');

    //config cookies
    app.use(cookieParser());

    //config session
    app.use(
        session({
            secret: configService.get<string>('EXPRESS_SESSION_SECRET'),
            resave: true,
            saveUninitialized: false,
            cookie: {
                maxAge:
                    ms(configService.get<string>('EXPRESS_SESSION_COOKIE')) /
                    1000,
            },
            store: MongoStore.create({
                mongoUrl: configService.get<string>('MONGODB_URI'),
            }),
        }),
    );

    //config passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Config CORS
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1', '2'],
    });

    await app.listen(port);
}
bootstrap();
