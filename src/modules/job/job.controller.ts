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
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { JobService } from './job.service';
import {
  AdminJobFilterDto,
  CompanyFilterJobDto,
  CreateJobDto,
  ExtendJobDto,
  JobFilterDto,
  MapDto,
} from './dto/create-job.dto';
import { UpdateJobAdminDto, UpdateJobDto } from './dto/update-job.dto';
import { GetToken, Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ACCOUNT_STATUS, ROLE_LIST } from 'src/types/enum';
import { UseSubscriptionDto } from 'src/employer_subscriptions/dto/create-employer_subscription.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Req() req, @Body() createJobDto: CreateJobDto) {
    const employerId = req.user.id;
    if (req.user.status === ACCOUNT_STATUS.BLOCKED) {
      throw new UnauthorizedException(
        'Your account is blocked. Please contact support.',
      );
    }
    return this.jobService.create(employerId, createJobDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER, ROLE_LIST.ADMIN)
  @Get('view-all-element-job/:id')
  async viewJob(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @GetToken()
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const accountId = req.user?.id;
    const filter = { id: +id } as JobFilterDto;
    const jobs = await this.jobService.filter(filter, accountId);
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

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('employer/request-publish/:id')
  publishJob(@Req() req, @Param('id') id: string) {
    const employerId = req.user.id;
    return this.jobService.requestPublishJob(+id, +employerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() dto: UpdateJobDto) {
    const employerId = req.user.id;
    if (req.user.status === ACCOUNT_STATUS.BLOCKED) {
      throw new UnauthorizedException(
        'Your account is blocked. Please contact support.',
      );
    }
    return this.jobService.update(+id, employerId, dto);
  }

  @GetToken()
  @Get('filter/search')
  filter(@Req() req, @Query() filterJobDto: JobFilterDto) {
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
  @Roles(ROLE_LIST.ADMIN)
  @Post('/refresh-job')
  refreshJob() {
    return this.jobService.refreshJobInPackage();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch('employer/toggle-is-show/:jobId')
  toggleViewStatus(@Req() req, @Param('jobId') jobId: number) {
    const employerId = req.user.id;
    return this.jobService.toggleIsShow(+employerId, jobId);
  }

  @Public()
  @Post('banner')
  getJobInBanner() {
    return this.jobService.getJobInBanner();
  }

  @Public()
  @Post('job-map')
  getJobInMap(@Body() map: MapDto) {
    return this.jobService.getJobInMap(map);
  }

  @Get('dashboard/employer/count')
  async getCountJobByEmployer(@Req() req) {
    const employerId = req.user.id;
    return this.jobService.getCountJobByEmployerId(+employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('use-subscription')
  useSubscription(@Req() req, @Body() body: UseSubscriptionDto) {
    const employerId = req.user.id;
    return this.jobService.jobUseSubscription(+employerId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('employer/request-publish/:jobId')
  requestPublishJob(@Req() req, @Param('jobId') jobId: number) {
    const employerId = req.user.id;
    return this.jobService.requestPublishJob(+employerId, jobId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch('/extend/:jobId')
  extendJob(
    @Req() req,
    @Param('jobId') jobId: number,
    @Body() body: ExtendJobDto,
  ) {
    const employerId = req.user.id;
    if (req.user.status === ACCOUNT_STATUS.BLOCKED) {
      throw new UnauthorizedException(
        'Your account is blocked. Please contact support.',
      );
    }
    return this.jobService.extendJob(+employerId, jobId, body.expiredAt);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('admin/get-dashboard')
  getDashboardData() {
    return this.jobService.getDashboardData();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('recommend-jobs-by-followed-employers')
  async getRecommendJobsByFollowedEmployers(@Req() req) {
    const candidateId = req.user.id;
    return this.jobService.getRecommendJobsByFollowedEmployers(+candidateId);
  }

  @Public()
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('recommend-jobs-best-viewed')
  async getRecommendJobsBestViewed() {
    return this.jobService.getRecommendJobsBestViewed();
  }
}
