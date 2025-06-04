import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { AccountModule } from '../account/account.module';
import { FollowModule } from '../follow/follow.module';
import { LanguageJobModule } from 'src/language-job/language-job.module';

@Module({
  imports: [
    LanguageJobModule,
    FollowModule,
    AccountModule,
    TypeOrmModule.forFeature([Job]),
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
