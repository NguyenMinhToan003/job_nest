import { Module } from '@nestjs/common';
import { ApplyJobService } from './apply-job.service';
import { ApplyJobController } from './apply-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyJob } from './entities/apply-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplyJob])],
  controllers: [ApplyJobController],
  providers: [ApplyJobService],
})
export class ApplyJobModule {}
