import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageResume } from './entities/language-resume.entity';
import { Repository } from 'typeorm';
import { CreateLanguageResumeDto } from './dto/create-language-resume.dto';

@Injectable()
export class LanguageResumeService {
  constructor(
    @InjectRepository(LanguageResume)
    private readonly languadeResumeRepository: Repository<LanguageResume>,
  ) {}

  async create(dto: CreateLanguageResumeDto) {
    return this.languadeResumeRepository.save({
      language: { id: +dto.languageId },
      resumeVersion: { id: +dto.resumeVersionId },
      level: dto.level,
    });
  }
}
