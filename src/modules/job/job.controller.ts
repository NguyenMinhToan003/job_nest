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
  AdminJobFilterDto,
  CompanyFilterJobDto,
  CreateJobDto,
  JobFilterDto,
} from './dto/create-job.dto';
import { UpdateJobAdminDto, UpdateJobDto } from './dto/update-job.dto';
import { Dynamic, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Req() req, @Body() createJobDto: CreateJobDto) {
    const employerId = req.user.id;
    return this.jobService.create(employerId, createJobDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER, ROLE_LIST.ADMIN)
  @Get('view/:id')
  async viewJob(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @Dynamic()
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const accountId = req.user?.id;
    const filter = { id: +id } as JobFilterDto;
    const jobs = await this.jobService.filter(filter, accountId);
    // console.log('jobs', jobs[0]);
    return jobs.total > 0 ? jobs.data[0] : null;
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post('/admin/filter')
  findAll(@Body() filter: AdminJobFilterDto) {
    return this.jobService.findAll(filter);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const employerId = req.user.id;
    return this.jobService.remove(+employerId, +id);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('employer')
  findByEmployerId(@Req() req, @Body() filter: CompanyFilterJobDto) {
    const employerId = req.user.id;
    return this.jobService.findByEmployerId(+employerId, filter);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateJobDto) {
    const employerId = req.user.id;
    return this.jobService.update(+id, employerId, dto);
  }

  @Dynamic()
  @Post('filter')
  filter(@Req() req, @Body() filterJobDto: JobFilterDto) {
    const accountId = req.user?.id;
    return this.jobService.filter(filterJobDto, accountId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch('admin/:jobId')
  changeStatusJob(@Param('jobId') id: number, @Body() dto: UpdateJobAdminDto) {
    return this.jobService.adminUpdate(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch('employer/toggle-is-show/:jobId')
  toggleViewStatus(@Req() req, @Param('jobId') jobId: number) {
    const employerId = req.user.id;
    return this.jobService.toggleIsShow(+employerId, jobId);
  }
}
