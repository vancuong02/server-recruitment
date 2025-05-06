import {
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Controller,
} from '@nestjs/common';
import { IUser } from '@/users/users.interface';
import { User } from '@/decorator/user.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';
import { QueryCompanyDto } from './dto/query-company.dto';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    @ResponseMessage('Tạo công ty thành công')
    async create(
        @User() user: IUser,
        @Body() createCompanyDto: CreateCompanyDto,
    ) {
        return this.companiesService.create(user, createCompanyDto);
    }

    @Get()
    @ResponseMessage('Lấy danh sách công ty thành công')
    findAll(@Query() query: QueryCompanyDto) {
        return this.companiesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật công ty thành công')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companiesService.update(user, id, updateCompanyDto);
    }

    @Delete(':id')
    @ResponseMessage('Xóa công ty thành công')
    remove(@User() user: IUser, @Param('id') id: string) {
        return this.companiesService.remove(user, id);
    }
}
