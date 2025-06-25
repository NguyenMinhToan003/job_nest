// src/my-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotoJobCandidateService {
  private readonly logger = new Logger(NotoJobCandidateService.name);

  // Cronjob chạy mỗi ngày lúc 9h sáng
  @Cron('0 9 * * *')
  handleCron() {
    this.logger.log('🌞 Cronjob chạy lúc 9h sáng!');
  }
  @Cron('51 19 * * *', {
    timeZone: 'Asia/Ho_Chi_Minh', // Đảm bảo chạy theo giờ Việt Nam
  })
  handleCrona() {
    this.logger.log('🔥 Cron chạy lúc 7h51 tối giờ Việt Nam');
  }
}
