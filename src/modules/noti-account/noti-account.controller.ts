import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { NotiAccountService } from './noti-account.service';
import {
  CreateNotiAccountDto,
  FilterNotiAccountDto,
} from './dto/create-noti-account.dto';

@Controller('noti-account')
export class NotiAccountController {
  constructor(private readonly notiAccountService: NotiAccountService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateNotiAccountDto) {
    const accountId = req.user.id;
    return this.notiAccountService.create(accountId, dto);
  }

  @Get('me')
  getMe(@Req() req, @Query() query: FilterNotiAccountDto) {
    const employerId = req.user.id;
    return this.notiAccountService.getMe(employerId, query);
  }

  @Get('me/mark-read')
  markAllAsRead(@Req() req) {
    const employerId = req.user.id;
    return this.notiAccountService.markAllAsRead(employerId);
  }

  @Get('me/mark-read/:id')
  markAsRead(@Req() req, @Param('id') id: string) {
    const employerId = req.user.id;
    return this.notiAccountService.markAsRead(employerId, +id);
  }

  @Get('count-unread')
  countUnread(@Req() req) {
    const employerId = req.user.id;
    return this.notiAccountService.countUnread(+employerId);
  }
}
