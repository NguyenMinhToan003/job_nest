import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import {
  CompanyFilterJobDto,
  CreateJobDto,
  JobFilterDto,
} from './dto/create-job.dto';
import { UpdateJobAdminDto, UpdateJobDto } from './dto/update-job.dto';
import { Public, ROLE_LIST, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Req() req, @Body() createJobDto: CreateJobDto) {
    const companyId = req.user.id;
    return this.jobService.create(companyId, createJobDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @Public()
  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.COMPANY)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const companyId = req.user.id;
    return this.jobService.remove(+companyId, +id);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.COMPANY)
  @Post('company')
  findByCompanyId(@Req() req, @Body() filter: CompanyFilterJobDto) {
    const companyId = req.user.id;
    return this.jobService.findByCompanyId(+companyId, filter);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateJobDto) {
    const companyId = req.user.id;
    return this.jobService.update(+id, companyId, dto);
  }

  @Public()
  @Post('filter')
  filter(@Body() filterJobDto: JobFilterDto) {
    return this.jobService.filter(filterJobDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch('admin/:jobId')
  changeStatusJob(@Param('jobId') id: number, @Body() dto: UpdateJobAdminDto) {
    return this.jobService.adminUpdate(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.COMPANY)
  @Patch('company/toggle-is-show/:jobId')
  toggleViewStatus(@Req() req, @Param('jobId') jobId: number) {
    const companyId = req.user.id;
    return this.jobService.toggleIsShow(+companyId, jobId);
  }
}
