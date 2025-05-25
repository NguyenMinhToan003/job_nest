import { Controller, Body, Get, Patch, Param, Req } from '@nestjs/common';
import { EmployerService } from './employer.service';
import { UpdateCompanyDto } from './dto/update-employer.dto';
import { Public } from 'src/decorators/customize';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

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
