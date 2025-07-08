// src/my-cron.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CandidateService } from 'src/modules/candidate/candidate.service';
import { JobService } from 'src/modules/job/job.service';
import { SaveJobService } from 'src/modules/save-job/save-job.service';
import { ViewJobService } from 'src/modules/view-job/view-job.service';

@Injectable()
export class NotoJobCandidateService {
  constructor(
    private readonly saveJobService: SaveJobService,
    private readonly viewJobService: ViewJobService,
    private readonly jobService: JobService,
    private readonly candaidateService: CandidateService,
    private readonly mailerService: MailerService,
  ) {}
  private readonly logger = new Logger(NotoJobCandidateService.name);

  @Cron('5 16 * * *')
  async handleCron() {
    const listCandidate = await this.candaidateService.findAllSendMailCronjob();
    listCandidate.forEach(async (candidate) => {
      const saveJobs = await this.saveJobService.getRecomended(candidate.id);
      const viewJobs = await this.viewJobService.recommendedViewJob(
        candidate.id,
      );
      const jobs = await this.jobService.getJobInBanner();
      this.mailerService.sendMail({
        to: candidate.account.email,
        subject: 'Những công việc mới phù hợp với bạn',
        template: 'noti-job-candidate',
        context: {
          candidateName: candidate.name,
          saveJobs,
          viewJobs,
          jobs,
        },
      });
    });
    this.logger.log('Cron job executed successfully: Noti Job Candidate');
  }
}
