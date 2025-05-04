import ms from 'ms';
import { join } from 'path';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

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

    //config view engine
    app.useStaticAssets(join(__dirname, '..', 'src/public'));

    //config cookies
    app.use(cookieParser());

    //config session
    app.use(
        session({
            secret: configService.get<string>('EXPRESS_SESSION_SECRET'),
            resave: true,
            saveUninitialized: false,
            cookie: {
                maxAge: ms(configService.get<string>('EXPRESS_SESSION_COOKIE')),
            },
            store: MongoStore.create({
                mongoUrl: configService.get<string>('MONGODB_URI'),
            }),
        }),
    );

    //config passport
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(port);
}
bootstrap();
