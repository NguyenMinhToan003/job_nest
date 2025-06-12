import { Module } from '@nestjs/common';
import { ApplyJobService } from './apply-job.service';
import { ApplyJobController } from './apply-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyJob } from './entities/apply-job.entity';
import { JobModule } from 'src/modules/job/job.module';
import { ResumeVersionModule } from 'src/modules/resume-version/resume-version.module';
import { MatchingWeightModule } from '../matching-weight/matching-weight.module';
import { MajorModule } from '../major/major.module';

@Module({
  imports: [
    MajorModule,
    MatchingWeightModule,
    ResumeVersionModule,
    JobModule,
    TypeOrmModule.forFeature([ApplyJob]),
  ],
  controllers: [ApplyJobController],
  providers: [ApplyJobService],
})
export class ApplyJobModule {}
