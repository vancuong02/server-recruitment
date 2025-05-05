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

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    @ResponseMessage('Tạo công ty thành công')
    async create(
        @Body() createCompanyDto: CreateCompanyDto,
        @User() user: IUser,
    ) {
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    @ResponseMessage('Lấy danh sách công ty thành công')
    findAll(
        @Query('name') name: string,
        @Query('current') current: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.companiesService.findAll(+current, +pageSize, name);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Cập nhật công ty thành công')
    update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    @ResponseMessage('Xóa công ty thành công')
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }
}
