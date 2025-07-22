import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplyJobService } from './apply-job.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import {
  AddTagResumeDto,
  CreateApplyJobDto,
  GetApplyByStatusDto,
  GetApplyByTagResumeDto,
  GetApplyJobByJobIdDto,
  SendMailToCandidateDto,
  UpdateApplyJobStatusDto,
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
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('candidate')
  getApplyJobByCandidateId(@Req() req) {
    const candidateId = req.user.id;
    return this.applyJobService.getApplyJobByCandidateId(+candidateId);
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
  @Get('employer/job')
  getApplyJobByJobId(@Req() req, @Query() query: GetApplyJobByJobIdDto) {
    const companyId = req.user.id;
    return this.applyJobService.getApplyJobByJobId(+companyId, query);
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

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('status/:applyId')
  updateStatus(
    @Req() req,
    @Param('applyId') applyId: number,
    @Body() body: UpdateApplyJobStatusDto,
  ) {
    const companyId = req.user.id;
    return this.applyJobService.updateStatus(companyId, +applyId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('addTag/:applyId')
  addTag(
    @Req() req,
    @Param('applyId') applyId: number,
    @Body() body: AddTagResumeDto,
  ) {
    const companyId = req.user.id;
    return this.applyJobService.addTag(companyId, +applyId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch('removeTag/:applyId')
  removeTag(
    @Req() req,
    @Param('applyId') applyId: number,
    @Body() body: AddTagResumeDto,
  ) {
    const companyId = req.user.id;
    return this.applyJobService.removeTag(companyId, +applyId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('feedback/:applyId')
  feedback(
    @Req() req,
    @Param('applyId') applyId: number,
    @Body('feedback') feedback: string,
  ) {
    const companyId = req.user.id;
    return this.applyJobService.feedback(companyId, +applyId, feedback);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('send-mail-to-candidate/:applyId')
  sendMailToCandidate(
    @Req() req,
    @Param('applyId') applyId: number,
    @Body() body: SendMailToCandidateDto,
  ) {
    const employerId = req.user.id;
    return this.applyJobService.sendMailToCandidate(employerId, +applyId, body);
  }

  @Get('dashboard/employer')
  getApplyJobDashboard(@Req() req) {
    const employerId = req.user.id;
    return this.applyJobService.getApplyJobDashboard(+employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('apply-job-by-tags')
  async getApplyJobByTags(@Req() req, @Query() dto: GetApplyByTagResumeDto) {
    const employerId = req.user.id;
    return this.applyJobService.getApplyJobByTags(+employerId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('view-apply/candidate/:jobId')
  async checkApply(@Req() req, @Param('jobId') jobId: number) {
    const candidateId = req.user.id;
    return this.applyJobService.checkApply(+candidateId, +jobId);
  }
}
