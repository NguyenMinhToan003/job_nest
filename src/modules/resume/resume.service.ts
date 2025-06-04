import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {}
  async create(candidateId: number) {
    return this.resumeRepository.save({
      candidate: { id: candidateId },
    });
  }
  async getAll(candidateId: number) {
    return this.resumeRepository.find({
      where: {
        candidate: { id: +candidateId },
      },
    });
  }
}
