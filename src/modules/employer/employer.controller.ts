import {
  Controller,
  Body,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { UpdateCompanyDto } from './dto/update-employer.dto';
import { Public, Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AdminFilterCompanyDto,
  FilterEmployerDto,
} from './dto/create-employer.dto';

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

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch('me')
  @UseInterceptors(FileInterceptor('logo'))
  async updateCompany(
    @UploadedFile() file: Express.Multer.File | null,
    @Req() req,
    @Body() dto: UpdateCompanyDto,
  ) {
    const id = req.user.id;
    return this.employerService.updated(id, dto, file);
  }

  @Public()
  @Get('detail/:companyId')
  async getCompanyDetail(@Param('companyId') companyId: number, @Req() req) {
    const accountId = req.user?.id;
    return this.employerService.getCompanyDetail(companyId, accountId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('me')
  async getMeEmployer(@Req() req) {
    const id = req.user.id;
    console.log(id);
    return this.employerService.getMeEmployer(id);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('all')
  async getAllEmployers(@Query() param: AdminFilterCompanyDto) {
    return this.employerService.getAllEmployers(param);
  }

  @Public()
  @Get('banner')
  async getBanner() {
    return this.employerService.getBanner();
  }

  @Public()
  @Get('filter/search')
  async filterSearch(@Query() query: FilterEmployerDto) {
    return this.employerService.filterSearch(query);
  }
}
