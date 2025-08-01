import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ViewJobService } from './view-job.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Public, Roles } from 'src/decorators/customize';
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
  @Get('me/:page/:limit')
  async getAllViewJobs(
    @Req() req,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    const userId = req.user.id;
    return this.viewJobService.paginateViewJob(userId, page, limit);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('recommended')
  async getRecommendedViewJobs(@Req() req) {
    const userId = req.user.id;
    return this.viewJobService.recommendedViewJob(userId);
  }
  @Public()
  @Get('getViews/:id')
  async getViewJobById(@Param('id') id: number) {
    return this.viewJobService.countViewJob(id);
  }

  @Get('dashboard/employer')
  async getViewJobByJobId(@Req() req) {
    const employerId = req.user.id;
    return this.viewJobService.getViewDashboard(employerId);
  }
}
