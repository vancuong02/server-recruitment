import helmet from 'helmet'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe, VersioningType, BadRequestException } from '@nestjs/common'

import { AppModule } from './app.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { setupSwagger } from './config/swagger.config'
import { TransformInterceptor } from './core/transform.interceptor'
import { ThrottlerExceptionFilter } from './core/throttler-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    // config helmet
    app.use(helmet())

    // config guard
    const reflector = app.get(Reflector)
    app.useGlobalGuards(new JwtAuthGuard(reflector))

    // config interceptor
    app.useGlobalInterceptors(new TransformInterceptor(reflector))

    // cogfig throttlerGuard
    app.useGlobalFilters(new ThrottlerExceptionFilter())

    // config validation
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors) => {
                const result = errors.map((error) => ({
                    property: error.property,
                    message: error.constraints ? Object.values(error.constraints)[0] : 'Lỗi validation',
                }))
                return new BadRequestException(result)
            },
            whitelist: true,
        }),
    )

    //config cookies
    app.use(cookieParser())

    //config passport
    app.use(passport.initialize())

    // config cors
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    })

    // config prefix api
    app.setGlobalPrefix('api')
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1'],
    })

    // config swagger
    setupSwagger(app)

    const configService = app.get(ConfigService)
    const port = configService.get<string>('PORT')
    await app.listen(port)
}
bootstrap()
