import { Module } from '@nestjs/common';
import { ResumeVersionService } from './resume-version.service';
import { ResumeVersionController } from './resume-version.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeVersion } from './entities/resume-version.entity';
import { UploadModule } from 'src/upload/upload.module';
import { ResumeModule } from '../resume/resume.module';
import { LanguageResumeModule } from '../language-resume/language-resume.module';
import { ResumeversionExpModule } from 'src/resumeversion-exp/resumeversion-exp.module';

@Module({
  imports: [
    ResumeversionExpModule,
    LanguageResumeModule,
    ResumeModule,
    UploadModule,
    TypeOrmModule.forFeature([ResumeVersion]),
  ],
  controllers: [ResumeVersionController],
  providers: [ResumeVersionService],
  exports: [ResumeVersionService],
})
export class ResumeVersionModule {}
