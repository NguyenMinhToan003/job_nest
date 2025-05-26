import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [AccountModule, TypeOrmModule.forFeature([Job])],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
