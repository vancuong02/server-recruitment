import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { MailController } from './mail.controller'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { SubscriberModel, SubscriberSchema } from '@/subscribers/schemas/subscriber.schema'
import { JobModel, JobSchema } from '@/jobs/schemas/job.schema'
import { SubscribersService } from '@/subscribers/subscribers.service'

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('EMAIL_HOST'),
                    secure: false,
                    auth: {
                        user: configService.get<string>('EMAIL_USERNAME'),
                        pass: configService.get<string>('EMAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `${configService.get<string>('FROM_NAME')} <${configService.get<string>('EMAIL_USERNAME')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: SubscriberModel.name, schema: SubscriberSchema },
            { name: JobModel.name, schema: JobSchema },
        ]),
    ],
    controllers: [MailController],
    providers: [SubscribersService],
})
export class MailModule {}
