// src/my-cron.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobService } from 'src/modules/job/job.service';

@Injectable()
export class refreshJobService {
  constructor(private readonly jobService: JobService) {}
  private readonly logger = new Logger(refreshJobService.name);

  @Cron('0 0 * * 1')
  async handlrefresh() {
    this.logger.debug('Running refresh job at 16:07 every day');
    return this.jobService.refreshJobInPackage();
  }
}
