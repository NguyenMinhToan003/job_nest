import { Controller, Post, Body, Get, Patch, Param, Req } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { CreateCompanyDto, LoginCompanyDto } from './dto/create-employer.dto';
import { UpdateCompanyDto } from './dto/update-employer.dto';
import { Public } from 'src/decorators/customize';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Public()
  @Post('register')
  register(@Body() dto: CreateCompanyDto) {
    return this.employerService.register(dto);
  }
  @Public()
  @Post('login')
  login(@Body() dto: LoginCompanyDto) {
    return this.employerService.login(dto);
  }
  @Public()
  @Get()
  async getAllCompanies() {
    return this.employerService.findAll();
  }

  @Get('info')
  async getEmployerInfo(@Req() req) {
    const id = req.user.id;
    return this.employerService.findOne(id);
  }

  @Patch(':id')
  async updateCompany(@Param('id') id, @Body() dto: UpdateCompanyDto) {
    return this.employerService.updated(id, dto);
  }

  @Public()
  @Get('detail/:companyId')
  async getCompanyDetail(@Param('companyId') companyId: number) {
    return this.employerService.getCompanyDetail(companyId);
  }
}
