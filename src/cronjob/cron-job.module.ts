// src/modules/cronjob/cronjob.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { CandidateModule } from 'src/modules/candidate/candidate.module';
import { JobModule } from 'src/modules/job/job.module';
import { SaveJobModule } from 'src/modules/save-job/save-job.module';
import { ViewJobModule } from 'src/view-job/view-job.module';
import { NotoJobCandidateService } from './noti-job-candidate.service';

@Module({
  imports: [
    SaveJobModule,
    ViewJobModule,
    JobModule,
    CandidateModule,
    MailerModule,
  ],
  providers: [NotoJobCandidateService],
})
export class CronJobModule {}
