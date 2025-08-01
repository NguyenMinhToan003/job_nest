import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { AccountModule } from '../account/account.module';
import { FollowModule } from '../follow/follow.module';
import { LanguageJobModule } from 'src/modules/language-job/language-job.module';
import { FieldModule } from '../field/field.module';
import { EmployerSubscriptionsModule } from '../employer_subscriptions/employer_subscriptions.module';
import { PackagesModule } from '../packages/packages.module';

@Module({
  imports: [
    PackagesModule,
    LanguageJobModule,
    FollowModule,
    EmployerSubscriptionsModule,
    FieldModule,
    AccountModule,
    TypeOrmModule.forFeature([Job]),
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
