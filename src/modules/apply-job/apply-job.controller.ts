import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplyJobService } from './apply-job.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import {
  CreateApplyJobDto,
  GetApplyByStatusDto,
  GetApplyJobByJobIdDto,
} from './dto/create-apply-job.dto';
import { ROLE_LIST } from 'src/types/enum';
import { Roles } from 'src/decorators/customize';

@Controller('apply-job')
export class ApplyJobController {
  constructor(private readonly applyJobService: ApplyJobService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Post(':jobId')
  applyJob(
    @Param('jobId') jobId: string,
    @Req() req,
    @Body() body: CreateApplyJobDto,
  ) {
    const candidateId = req.user.id;
    return this.applyJobService.applyJob(+jobId, +candidateId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Post('un-apply/:jobId')
  unApply(@Req() req, @Param('jobId') jobId: number) {
    const candidateId = req.user.id;
    return this.applyJobService.unApply(candidateId, jobId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('me')
  getMe(@Req() req) {
    const candidateId = req.user.id;
    return this.applyJobService.getMe(+candidateId);
  }
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('me/status/:status')
  getMeByStatus(@Req() req, @Param() param: GetApplyByStatusDto) {
    const candidateId = req.user.id;
    return this.applyJobService.getMeByStatus(+candidateId, param);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('employer')
  getApplyJobByCompanyId(@Req() req) {
    const companyId = req.user.id;
    return this.applyJobService.getApplyJobByCompanyId(+companyId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('employer/job/:jobId')
  getApplyJobByJobId(@Req() req, @Param() param: GetApplyJobByJobIdDto) {
    const companyId = req.user.id;
    return this.applyJobService.getApplyJobByJobId(+companyId, param);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('mark-view/:applyId')
  getResumeById(@Param('applyId') applyId: number) {
    return this.applyJobService.markView(+applyId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('employer/analys/:applyId')
  getResumeVersionForJob(@Req() req, @Param('applyId') applyId: number) {
    const companyId = req.user.id;
    return this.applyJobService.getResumeVersionForJob(companyId, +applyId);
  }
}
