import { Module } from '@nestjs/common';
import { TagResumeService } from './tag-resume.service';
import { TagResumeController } from './tag-resume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagResume } from './entities/tag-resume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagResume])],
  controllers: [TagResumeController],
  providers: [TagResumeService],
})
export class TagResumeModule {}
