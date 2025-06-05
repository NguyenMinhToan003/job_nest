import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageJob } from './entities/language-job.entity';
import { Repository } from 'typeorm';
import { CreateLanguageJobDto } from './dto/create-language-job.dto';

@Injectable()
export class LanguageJobService {
  constructor(
    @InjectRepository(LanguageJob)
    private readonly languageJobRepository: Repository<LanguageJob>,
  ) {}

  async create(dto: CreateLanguageJobDto) {
    return this.languageJobRepository.save({
      job: { id: dto.jobId },
      language: { id: dto.languageId },
      level: dto.level,
    });
  }
}
