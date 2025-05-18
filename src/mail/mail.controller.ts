import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Controller, Post } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { convertSlug } from '@/utils';
import { JobDocument, JobModel } from '@/jobs/schemas/job.schema';
import { SubscribersService } from '@/subscribers/subscribers.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
    constructor(
        @InjectModel(JobModel.name)
        private jobModel: Model<JobDocument>,
        private mailerService: MailerService,
        private subscriberService: SubscribersService,
    ) {}

    @Post()
    @Cron('0 0 8 * * *')
    async handleSendEmail() {
        try {
            const subscribers = await this.subscriberService.findAll();
            for (const subscriber of subscribers) {
                const condition = {
                    $and: [
                        {
                            skills: { $in: subscriber.skills },
                        },
                        {
                            isActive: true,
                        },
                        {
                            isDeleted: false,
                        },
                        {
                            endDate: { $gte: new Date() },
                        },
                    ],
                };

                const jobs = await this.jobModel
                    .find(condition)
                    .populate('companyId', 'name')
                    .limit(10)
                    .lean();

                const jobsForTemplate = jobs.map((job) => {
                    const slug = convertSlug(job.name);
                    return {
                        name: job.name,
                        company_name: (job.companyId as any).name,
                        salary: job.salary,
                        locations: job.locations,
                        skills: job.skills,
                        jobUrl: `${process.env.CLIENT_URL}/job/${slug}?id=${job._id}`,
                    };
                });

                if (jobsForTemplate.length > 0) {
                    await this.mailerService.sendMail({
                        to: subscriber.email,
                        subject: 'Công việc phù hợp với bạn hôm nay',
                        template: 'suggest',
                        context: {
                            totalJobs: jobs.length,
                            jobs: jobsForTemplate,
                            viewAllJobsUrl: `${process.env.CLIENT_URL}/job`,
                            unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe`,
                        },
                    });
                }
            }
        } catch (error) {
            console.error('Lỗi khi gửi email tự động:', error);
        }
    }
}
