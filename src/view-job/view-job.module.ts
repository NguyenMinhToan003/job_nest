import { Module } from '@nestjs/common';
import { ViewJobService } from './view-job.service';
import { ViewJobController } from './view-job.controller';

@Module({
  controllers: [ViewJobController],
  providers: [ViewJobService],
})
export class ViewJobModule {}
