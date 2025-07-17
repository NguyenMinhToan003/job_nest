// src/modules/cronjob/cronjob.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { CandidateModule } from 'src/modules/candidate/candidate.module';
import { JobModule } from 'src/modules/job/job.module';
import { SaveJobModule } from 'src/modules/save-job/save-job.module';
import { NotoJobCandidateService } from './noti-job-candidate.service';
import { refreshJobService } from './refresh-job.service';
import { ViewJobModule } from 'src/modules/view-job/view-job.module';
import { ResumeVersionModule } from 'src/modules/resume-version/resume-version.module';

@Module({
  imports: [
    SaveJobModule,
    ViewJobModule,
    JobModule,
    ResumeVersionModule,
    CandidateModule,
    MailerModule,
  ],
  providers: [NotoJobCandidateService, refreshJobService],
})
export class CronJobModule {}
