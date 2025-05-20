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
import { CreateJobDto, JobFilterDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.COMPANY)
  @Post('company')
  findByCompanyId(@Req() req) {
    const companyId = req.user.id;
    return this.jobService.findByCompanyId(+companyId);
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
}
