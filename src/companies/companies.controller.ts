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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '@/decorator/user.decorator';
import { IUser } from '@/users/users.interface';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    async create(
        @Body() createCompanyDto: CreateCompanyDto,
        @User() user: IUser,
    ) {
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    findAll(
        @Query('current') current: string,
        @Query('pageSize') pageSize: string,
        @Query('name') name: string,
    ) {
        return this.companiesService.findAll(+current, +pageSize, name);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }
}
