import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { NotiAccountService } from './noti-account.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { CreateNotiAccountDto } from './dto/create-noti-account.dto';

@Controller('noti-account')
export class NotiAccountController {
  constructor(private readonly notiAccountService: NotiAccountService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateNotiAccountDto) {
    const accountId = req.user.id;
    return this.notiAccountService.create(accountId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('me')
  getMe(@Req() req) {
    const employerId = req.user.id;
    return this.notiAccountService.getMe(employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('me/mark-read')
  markAllAsRead(@Req() req) {
    const employerId = req.user.id;
    return this.notiAccountService.markAllAsRead(employerId);
  }
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('count-unread')
  countUnread(@Req() req) {
    const employerId = req.user.id;
    return this.notiAccountService.countUnread(+employerId);
  }
}
