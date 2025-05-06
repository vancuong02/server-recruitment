import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { User } from '@/decorator/user.decorator';
import { IUser } from '@/users/users.interface';
import { ResponseMessage } from '@/decorator/customize.decorator';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    @ResponseMessage('Tạo việc làm thành công')
    create(@User() user: IUser, @Body() createJobDto: CreateJobDto) {
        return this.jobsService.create(user, createJobDto);
    }

    @Get()
    @ResponseMessage('Lấy danh sách việc làm thành công')
    findAll(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        return this.jobsService.findAll(+page, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobsService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật việc làm thành công')
    update(
        @Param('id') id: string,
        @Body() updateJobDto: UpdateJobDto,
        @User() user: IUser,
    ) {
        return this.jobsService.update(id, updateJobDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Xóa việc làm thành công')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.jobsService.remove(id, user);
    }
}
