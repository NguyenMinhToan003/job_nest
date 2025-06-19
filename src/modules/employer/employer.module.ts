import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { Employer } from './entities/employer.entity';
import { LocationModule } from '../location/location.module';
import { FollowModule } from '../follow/follow.module';
import { JobModule } from '../job/job.module';
import { EmployerSubscriptionsModule } from 'src/employer_subscriptions/employer_subscriptions.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    EmployerSubscriptionsModule,
    JobModule,
    FollowModule,
    LocationModule,
    TypeOrmModule.forFeature([Employer]),
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
