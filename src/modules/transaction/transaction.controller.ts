import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Public, Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { AdminFilterTransactionDto } from './dto/create-transaction.dto';

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

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER, ROLE_LIST.ADMIN)
  @Get(':id')
  async getTransactionDetail(@Req() req, @Param('id') transactionId: number) {
    return this.transactionService.getTransactionDetail(transactionId);
  }

  @Public()
  @Get('checkout/:id')
  async getTransactionById(@Param('id') transactionId: number) {
    return this.transactionService.getTransactionById(transactionId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('admin/get-all')
  async getTransactionDetailAdmin(@Query() query: AdminFilterTransactionDto) {
    return this.transactionService.getAllTransactions(query);
  }
}
