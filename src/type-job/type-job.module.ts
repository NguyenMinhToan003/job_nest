import { Module } from '@nestjs/common';
import { TypeJobService } from './type-job.service';
import { TypeJobController } from './type-job.controller';

@Module({
  controllers: [TypeJobController],
  providers: [TypeJobService],
})
export class TypeJobModule {}
