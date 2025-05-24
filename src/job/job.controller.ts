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
import { Public, Roles } from 'src/decorators/customize';
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
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch('employer/toggle-is-show/:jobId')
  toggleViewStatus(@Req() req, @Param('jobId') jobId: number) {
    const employerId = req.user.id;
    return this.jobService.toggleIsShow(+employerId, jobId);
  }
}
