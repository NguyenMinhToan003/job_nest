import { Injectable } from '@nestjs/common';
import { ResumeversionExp } from './entities/resumeversion-exp.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResumeversionExpDto } from './dto/create-resumeversion-exp.dto';

@Injectable()
export class ResumeversionExpService {
  constructor(
    @InjectRepository(ResumeversionExp)
    private readonly resumeversionExpRepository: Repository<ResumeversionExp>,
  ) {}

  async create(dto: CreateResumeversionExpDto) {
    return this.resumeversionExpRepository.save({
      companyName: dto.companyName,
      position: dto.position,
      startTime: dto.startTime,
      endTime: dto.endTime,
      jobDescription: dto.jobDescription,
      resumeVersion: { id: dto.resumeVersionId },
    });
  }
}
