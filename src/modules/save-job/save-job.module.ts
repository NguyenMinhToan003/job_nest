import { Module } from '@nestjs/common';
import { SaveJobService } from './save-job.service';
import { SaveJobController } from './save-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveJob } from './entities/save-job.entity';
import { JobModule } from 'src/modules/job/job.module';

@Module({
  imports: [JobModule, TypeOrmModule.forFeature([SaveJob])],
  controllers: [SaveJobController],
  providers: [SaveJobService],
})
export class SaveJobModule {}
