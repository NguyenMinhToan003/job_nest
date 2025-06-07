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
  async create(candidateId: number, name?: string) {
    return this.resumeRepository.save({
      candidate: { id: candidateId },
      name: name ? name : 'Hồ sơ ' + candidateId,
    });
  }
  async getAll(candidateId: number) {
    return this.resumeRepository.find({
      where: {
        candidate: { id: +candidateId },
      },
    });
  }
  async validateMe(candidateId: number, resumeId: number) {
    return this.resumeRepository.findOne({
      where: {
        id: +resumeId,
        candidate: { id: +candidateId },
      },
    });
  }
  async update(candidateId: number, resumeId: number, name: string) {
    const resume = await this.validateMe(candidateId, resumeId);
    if (!resume) {
      throw new Error('Hồ sơ không tồn tại hoặc bạn không có quyền truy cập');
    }
    return this.resumeRepository.save({
      ...resume,
      name,
    });
  }

  async delete(candidateId: number, resumeId: number) {
    const resume = await this.validateMe(candidateId, resumeId);
    if (!resume) {
      throw new Error('Hồ sơ không tồn tại hoặc bạn không có quyền truy cập');
    }
    return this.resumeRepository.remove(resume);
  }
}
