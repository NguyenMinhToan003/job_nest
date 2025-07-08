import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { EmployerSubscriptionsModule } from '../employer_subscriptions/employer_subscriptions.module';
import { PackagesModule } from '../packages/packages.module';

@Module({
  imports: [
    EmployerSubscriptionsModule,
    PackagesModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
