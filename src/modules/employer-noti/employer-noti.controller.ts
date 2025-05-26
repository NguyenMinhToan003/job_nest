import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EmployerNotiService } from './employer-noti.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { CreateEmployerNotiDto } from './dto/create-employer-noti.dto';

@Controller('employer-noti')
export class EmployerNotiController {
  constructor(private readonly employerNotiService: EmployerNotiService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  create(@Body() dto: CreateEmployerNotiDto) {
    return this.employerNotiService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('me')
  findAllByEmployerId(@Req() req) {
    const employerId = req.user.id;
    return this.employerNotiService.findAllByEmployerId(employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('me/mark-read')
  markAllAsRead(@Req() req) {
    const employerId = req.user.id;
    return this.employerNotiService.markAllAsRead(employerId);
  }
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('count-unread')
  countUnread(@Req() req) {
    const employerId = req.user.id;
    return this.employerNotiService.countUnread(+employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Post('apply-job')
  applyNoti(@Body() dto: CreateEmployerNotiDto, @Req() req) {
    const canmdidateId = req.user.id;
    return this.employerNotiService.applyNoti(+canmdidateId, dto);
  }
}
