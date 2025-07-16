import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow-employer/:employer')
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  followEmployer(@Param('employer') employerId: number, @Req() req) {
    const candidateId = req.user.id;
    return this.followService.followEmployer(employerId, candidateId);
  }

  @Get('candidate/me/:page/:limit')
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  candidateGetAllFollows(
    @Req() req,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    const candidateId = req.user.id;
    return this.followService.candidateGetAllFollows(candidateId, page, limit);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Delete('unfollow-employer/:employer')
  unfollowEmployer(@Param('employer') employerId: number, @Req() req) {
    const candidateId = req.user.id;
    return this.followService.unfollowEmployer(employerId, candidateId);
  }
}
