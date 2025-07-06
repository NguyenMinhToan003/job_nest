import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ACCOUNT_STATUS, ROLE_LIST } from 'src/types/enum';
import { ChangeStatusDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch('block-account-employer')
  async toggleStatusEmployer(@Req() req) {
    const employerId = req.user.id;
    return this.accountService.changeStatus(employerId, ACCOUNT_STATUS.BLOCKED);
  }
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch('change-status')
  async changeStatus(@Body() body: ChangeStatusDto) {
    return this.accountService.changeStatus(body.accountId, body.status);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('admin/get-dashboard-data')
  async getDashboardData() {
    return this.accountService.getDashboardData();
  }
}
