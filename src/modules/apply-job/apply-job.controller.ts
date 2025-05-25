import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplyJobService } from './apply-job.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import {
  ApplyJobWithNewCvDto,
  CreateApplyJobDto,
  GetApplyByStatusDto,
  GetApplyJobByJobIdDto,
} from './dto/create-apply-job.dto';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('cv'))
  @Post('apply-new-cv/:jobId')
  applyJobWithNewCv(
    @UploadedFile()
    cv: Express.Multer.File,
    @Param('jobId') jobId: string,
    @Req() req,
    @Body() body: ApplyJobWithNewCvDto,
  ) {
    const candidateId = req.user.id;
    return this.applyJobService.applyJobWithNewCv(
      cv,
      +jobId,
      +candidateId,
      body,
    );
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
}
