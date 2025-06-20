import { Module } from '@nestjs/common';
import { EmployerSubscriptionsService } from './employer_subscriptions.service';
import { EmployerSubscriptionsController } from './employer_subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerSubscription } from './entities/employer_subscription.entity';
import { PackagesModule } from 'src/packages/packages.module';

@Module({
  imports: [PackagesModule, TypeOrmModule.forFeature([EmployerSubscription])],
  controllers: [EmployerSubscriptionsController],
  providers: [EmployerSubscriptionsService],
  exports: [EmployerSubscriptionsService],
})
export class EmployerSubscriptionsModule {}
