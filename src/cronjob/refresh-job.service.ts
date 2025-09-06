// src/my-cron.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobService } from 'src/modules/job/job.service';
import { ResumeVersionService } from 'src/modules/resume-version/resume-version.service';

@Injectable()
export class refreshJobService {
  constructor(
    private readonly jobService: JobService,
    private readonly resumeVersionService: ResumeVersionService,
  ) {}
  private readonly logger = new Logger(refreshJobService.name);

  @Cron('0 0 * * *')
  async handlrefresh() {
    this.logger.debug('Running refresh job at 16:07 every day');
    return this.jobService.refreshJobInPackage();
  }
  @Cron('0 0 * * *')
  async deleteResumeVersion() {
    this.logger.debug('Running refresh job at 11:00 every day');
    return this.resumeVersionService.deleteVersionDraft();
  }
  @Cron('*/5 * * * *')
  async logServerStatus() {
    this.logger.debug('Checking server status every 5 minutes');
  }
}
