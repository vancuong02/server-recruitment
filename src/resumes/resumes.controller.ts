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
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';
import { IUser } from '@/users/users.interface';
import { User } from '@/decorator/user.decorator';

@Controller('resumes')
export class ResumesController {
    constructor(private readonly resumesService: ResumesService) {}

    @Post()
    @ResponseMessage('Tạo resume thành công')
    create(@User() user: IUser, @Body() createResumeDto: CreateResumeDto) {
        return this.resumesService.create(user, createResumeDto);
    }

    @Get()
    @ResponseMessage('Lấy danh sách resume thành công')
    findAll(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        return this.resumesService.findAll(+page, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resumesService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật resume thành công')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() updateResumeDto: UpdateResumeDto,
    ) {
        return this.resumesService.update(user, id, updateResumeDto);
    }

    @Delete(':id')
    @ResponseMessage('Xóa resume thành công')
    remove(@User() user: IUser, @Param('id') id: string) {
        return this.resumesService.remove(user, id);
    }
}
