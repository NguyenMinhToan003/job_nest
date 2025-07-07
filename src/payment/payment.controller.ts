import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { Public, Roles } from 'src/decorators/customize';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('create')
  async createPayment(@Body() dto: CreateTransactionDto, @Req() req) {
    const employerId = req.user.id;
    dto.employerId = employerId;
    return await this.paymentService.createPaymentUrl(dto);
  }

  @Public()
  @Get('callback')
  async handleCallback(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentService.handleCallback(query);
    res.redirect(
      `http://localhost:5173/payment-result?status=${result.status}&&transactionId=${result.transactionId}`,
    );
  }

  @Get('ipn')
  async handleIpn(@Query() query: any) {
    return await this.paymentService.handleIpn(query);
  }
}
