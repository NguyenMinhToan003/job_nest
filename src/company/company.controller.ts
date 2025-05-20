import { Controller, Post, Body, Get, Patch, Param, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, LoginCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public } from 'src/decorators/customize';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Public()
  @Post('register')
  register(@Body() dto: CreateCompanyDto) {
    return this.companyService.register(dto);
  }
  @Public()
  @Post('login')
  login(@Body() dto: LoginCompanyDto) {
    return this.companyService.login(dto);
  }
  @Public()
  @Get()
  async getAllCompanies() {
    return this.companyService.findAll();
  }

  @Get('info')
  async getCompanyInfo(@Req() req) {
    const id = req.user.id;
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  async updateCompany(@Param('id') id, @Body() dto: UpdateCompanyDto) {
    return this.companyService.updated(id, dto);
  }

  @Public()
  @Get('detail/:companyId')
  async getCompanyDetail(@Param('companyId') companyId: number) {
    return this.companyService.getCompanyDetail(companyId);
  }
}
