import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { RolesGuard } from 'src/auth/passport/role.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('me')
  async getMyTransactions(@Req() req) {
    const employerId = req.user.id;
    return this.transactionService.getMyTransactions(employerId);
  }
}
