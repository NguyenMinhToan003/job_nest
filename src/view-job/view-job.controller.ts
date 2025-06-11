import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ViewJobService } from './view-job.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';

@Controller('view-job')
export class ViewJobController {
  constructor(private readonly viewJobService: ViewJobService) {}
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Post(':jobId')
  async viewJob(@Req() req, @Param('jobId') jobId: number) {
    const userId = req.user.id;
    return this.viewJobService.viewJob(userId, jobId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get()
  async getAllViewJobs(@Req() req) {
    const userId = req.user.id;
    return this.viewJobService.getAllViewJobs(userId);
  }
}
