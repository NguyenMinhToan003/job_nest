import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { VnpayModule } from 'nestjs-vnpay';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PackagesModule } from '../packages/packages.module';
import { EmployerSubscriptionsModule } from 'src/employer_subscriptions/employer_subscriptions.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule,
    TransactionModule,
    VnpayModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        tmnCode: configService.getOrThrow<string>('VNPAY_TMN_CODE'),
        secureSecret: configService.getOrThrow<string>('VNPAY_HASH_SECRET'),
        vnpayHost: configService.getOrThrow<string>('VNPAY_URL'),
        returnUrl: configService.getOrThrow<string>('VNPAY_RETURN_URL'),
        ipnUrl: configService.getOrThrow<string>('VNPAY_IPN_URL'),
        vnp_Version: '2.1.0',
        testMode: true,
      }),
      inject: [ConfigService],
    }),
    EmployerSubscriptionsModule,
    PackagesModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
