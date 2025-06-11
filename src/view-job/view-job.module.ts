import { Module } from '@nestjs/common';
import { ViewJobService } from './view-job.service';
import { ViewJobController } from './view-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewJob } from './entities/view-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViewJob])],
  controllers: [ViewJobController],
  providers: [ViewJobService],
})
export class ViewJobModule {}
