import { Module } from '@nestjs/common';
import { ViewJobService } from './view-job.service';
import { ViewJobController } from './view-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewJob } from './entities/view-job.entity';
import { JobModule } from 'src/modules/job/job.module';

@Module({
  imports: [JobModule, TypeOrmModule.forFeature([ViewJob])],
  controllers: [ViewJobController],
  providers: [ViewJobService],
  exports: [ViewJobService],
})
export class ViewJobModule {}
