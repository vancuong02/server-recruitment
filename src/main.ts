import { ValidationPipe, VersioningType, BadRequestException } from '@nestjs/common'
import helmet from 'helmet'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { setupSwagger } from './config/swagger.config'
import { TransformInterceptor } from './core/transform.interceptor'
import { ThrottlerExceptionFilter } from './core/throttler-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    // Config Helmet
    app.use(helmet())

    // Config Guard
    const reflector = app.get(Reflector)
    app.useGlobalGuards(new JwtAuthGuard(reflector))

    // Config Interceptor
    app.useGlobalInterceptors(new TransformInterceptor(reflector))

    // Cogfig ThrottlerGuard
    app.useGlobalFilters(new ThrottlerExceptionFilter())

    // Config Validation
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

    const configService = app.get(ConfigService)
    const port = configService.get<string>('PORT')

    //config cookies
    app.use(cookieParser())

    //config passport
    app.use(passport.initialize())

    // Config CORS
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    })

    app.setGlobalPrefix('api')
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1'],
    })

    // Config Swagger
    setupSwagger(app)

    await app.listen(port)
}
bootstrap()
