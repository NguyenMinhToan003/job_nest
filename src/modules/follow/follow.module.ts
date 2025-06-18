import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { Follow } from './entities/follow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeVersionModule } from '../resume-version/resume-version.module';

@Module({
  imports: [ResumeVersionModule, TypeOrmModule.forFeature([Follow])],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
