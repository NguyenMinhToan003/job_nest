import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EmployerSubscriptionsService } from './employer_subscriptions.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { UseSubBannerDto } from './dto/create-employer_subscription.dto';

@Controller('employer-sub')
export class EmployerSubscriptionsController {
  constructor(
    private readonly employerSubscriptionsService: EmployerSubscriptionsService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('me')
  async getMySubscription(@Req() req) {
    const employerId = req.user.id;
    return this.employerSubscriptionsService.getMySubscription(employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('non-job-active')
  async getMySubscriptionNonJobStatusActive(@Req() req) {
    const employerId = req.user.id;
    return this.employerSubscriptionsService.getMySubscriptionNonJobStatusActive(
      employerId,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('use-subscription/banner-employer')
  async useSubscriptionBanner(@Req() req, @Body() body: UseSubBannerDto) {
    const employerId = req.user.id;
    return this.employerSubscriptionsService.useSubscriptionBanner(
      employerId,
      body,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('get-all-in-package/:packageId')
  async getAllInPackage(@Req() req) {
    const packageId = req.params.packageId;
    return this.employerSubscriptionsService.getAllInPackage(packageId);
  }
}
