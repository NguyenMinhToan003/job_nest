import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { VnpayService } from 'nestjs-vnpay';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import { PAYMENT_STATUS } from 'src/types/enum';
import { dateFormat } from 'vnpay';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly vnpayService: VnpayService,
    private readonly mailerService: MailerService,
  ) {}

  async createPaymentUrl(
    dto: CreateTransactionDto,
  ): Promise<{ transaction: Transaction; paymentUrl: string }> {
    const { employerId, transactionType } = dto;
    if (transactionType !== 'VNPAY') {
      throw new BadRequestException('Phương thức thanh toán không hỗ trợ');
    }

    // Tạo giao dịch
    const transaction = await this.transactionService.createTransaction({
      subscriptions: dto.subscriptions,
      employerId,
      transactionType,
    });
    // Tạo mã giao dịch VNPay
    const date = new Date();
    const vnp_TxnRef = `TXN${transaction.id}${dateFormat(date, 'HHmmss')}`;

    try {
      const paymentUrl = this.vnpayService.buildPaymentUrl({
        vnp_Amount: transaction.amount,
        vnp_TxnRef,
        vnp_OrderInfo: `Thanh toán giao dịch ${vnp_TxnRef}`,
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
        vnp_IpAddr: '127.0.1',
      });
      this.logger.log(`Payment URL created: ${paymentUrl}`);
      await this.transactionService.update(transaction.id, {
        vnp_TxnRef,
      });
      return { transaction, paymentUrl };
    } catch (error) {
      this.logger.error(`Error creating payment URL: ${error.message}`);
      throw new BadRequestException('Lỗi tạo URL thanh toán');
    }
  }

  async handleCallback(query: any): Promise<{
    status: string;
    message: string;
    transactionId;
  }> {
    const { vnp_TxnRef, vnp_ResponseCode } = query;
    console.log(vnp_ResponseCode, vnp_TxnRef);
    // Kiểm tra chữ ký
    const isValid = this.vnpayService.verifyReturnUrl(query);
    if (!isValid) {
      this.logger.error(`Invalid signature for transaction ${vnp_TxnRef}`);
      throw new BadRequestException('Chữ ký không hợp lệ');
    }

    // Tìm giao dịch
    const transaction =
      await this.transactionService.findOneByVnpTxnRef(vnp_TxnRef);

    if (!transaction) {
      this.logger.error(`Transaction not found: ${vnp_TxnRef}`);
      throw new BadRequestException('Giao dịch không tồn tại');
    }

    // Cập nhật trạng thái giao dịch
    if (
      vnp_ResponseCode === '00' &&
      transaction.status === PAYMENT_STATUS.PENDING
    ) {
      transaction.status = PAYMENT_STATUS.SUCCESS;
      transaction.recordedAt = new Date();
      await this.transactionService.update(transaction.id, transaction);
      this.mailerService.sendMail({
        to: transaction.employer.account.email,
        from: 'tuyendung123@gmail.com',
        subject: `Thanh toán thành công - ${transaction.vnp_TxnRef}`,
        template: 'job-status',
        context: {
          content: `Thanh toán thành công cho giao dịch ${transaction.vnp_TxnRef}`,
          link: `/danh-cho-nha-tuyen-dung/dich-vu/${transaction.id}`,
          title: `Thanh toán thành công - ${transaction.vnp_TxnRef}`,
        },
      });
      return {
        status: 'success',
        message: 'Thanh toán thành công',
        transactionId: transaction.id,
      };
    } else {
      transaction.status = PAYMENT_STATUS.FAILED;
      transaction.recordedAt = new Date();
      await this.transactionService.update(transaction.id, transaction);
      this.mailerService.sendMail({
        to: transaction.employer.account.email,
        from: 'tuyendung123@gmail.com',
        subject: `Thanh toán thất bại - ${transaction.vnp_TxnRef}`,
        template: 'job-status',
        context: {
          content: `Thanh toán thất bại cho giao dịch ${transaction.vnp_TxnRef}`,
          link: `/danh-cho-nha-tuyen-dung/dich-vu/${transaction.id}`,
          title: `Thanh toán thất bại - ${transaction.vnp_TxnRef}`,
        },
      });
      return {
        status: 'failed',
        message: 'Thanh toán thất bại',
        transactionId: null,
      };
    }
  }

  async handleIpn(query: any): Promise<{ RspCode: string; Message: string }> {
    const { vnp_TxnRef, vnp_ResponseCode } = query;
    // Kiểm tra chữ ký
    const isValid = this.vnpayService.verifyReturnUrl(query);
    if (!isValid) {
      this.logger.error(`Invalid IPN signature for transaction ${vnp_TxnRef}`);
      return { RspCode: '97', Message: 'Invalid signature' };
    }

    // Tìm giao dịch
    const transaction = await this.transactionService.findOne(vnp_TxnRef);

    if (!transaction) {
      this.logger.error(`Transaction not found: ${vnp_TxnRef}`);
      return { RspCode: '01', Message: 'Transaction not found' };
    }

    // Cập nhật trạng thái nếu chưa xử lý
    if (transaction.status === PAYMENT_STATUS.PENDING) {
      transaction.status =
        vnp_ResponseCode === '00'
          ? PAYMENT_STATUS.SUCCESS
          : PAYMENT_STATUS.FAILED;
      if (vnp_ResponseCode === '00') {
        transaction.recordedAt = new Date();
        await this.transactionService.update(transaction.id, transaction);
      } else {
        await this.transactionService.update(transaction.id, {
          status: PAYMENT_STATUS.FAILED,
        });
      }
    }

    return { RspCode: '00', Message: 'Confirm Success' };
  }
}
