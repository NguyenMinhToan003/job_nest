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
import { ROLE_LIST, Roles } from 'src/decorators/customize';
import {
  CreateApplyJobDto,
  GetApplyByStatusDto,
  GetApplyJobByJobIdDto,
} from './dto/create-apply-job.dto';

@Controller('apply-job')
export class ApplyJobController {
  constructor(private readonly applyJobService: ApplyJobService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.USER)
  @Post(':jobId')
  applyJob(
    @Param('jobId') jobId: string,
    @Req() req,
    @Body() body: CreateApplyJobDto,
  ) {
    const userId = req.user.id;
    return this.applyJobService.applyJob(+jobId, +userId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.USER)
  @Get('me')
  getMe(@Req() req) {
    const userId = req.user.id;
    return this.applyJobService.getMe(+userId);
  }
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.USER)
  @Get('me/status/:status')
  getMeByStatus(@Req() req, @Param() param: GetApplyByStatusDto) {
    const userId = req.user.id;
    return this.applyJobService.getMeByStatus(+userId, param);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.COMPANY)
  @Get('company')
  getApplyJobByCompanyId(@Req() req) {
    const companyId = req.user.id;
    return this.applyJobService.getApplyJobByCompanyId(+companyId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.COMPANY)
  @Get('company/job/:jobId')
  getApplyJobByJobId(@Req() req, @Param() param: GetApplyJobByJobIdDto) {
    const companyId = req.user.id;
    return this.applyJobService.getApplyJobByJobId(+companyId, param);
  }
}
