import { Module } from '@nestjs/common';
import { LanguageResumeService } from './language-resume.service';
import { LanguageResumeController } from './language-resume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageResume } from './entities/language-resume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageResume])],
  controllers: [LanguageResumeController],
  providers: [LanguageResumeService],
  exports: [LanguageResumeService],
})
export class LanguageResumeModule {}
