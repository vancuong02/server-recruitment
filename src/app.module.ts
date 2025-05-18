import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { FilesModule } from './files/files.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 20,
                },
            ],
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                connectionFactory: (connection) => {
                    connection.plugin(softDeletePlugin);
                    return connection;
                },
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        CompaniesModule,
        JobsModule,
        ResumesModule,
        PermissionsModule,
        RolesModule,
        FilesModule,
        SubscribersModule,
        MailModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
