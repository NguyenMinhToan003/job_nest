import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
  ) {}

  async createDefaultEducation() {
    const defaultEducation = [
      { id: 6, name: 'Không yêu cầu bằng cấp' },
      { id: 1, name: 'Cao đẳng (College)' },
      { id: 2, name: 'Đại học (Bachelor)' },
      { id: 3, name: 'Thạc sĩ (Master)' },
      { id: 4, name: 'Tiến sĩ (PhD)' },
      { id: 5, name: 'Trình độ khác' },
    ];
    await this.educationRepository.save(defaultEducation);
  }

  async getAllEducation() {
    return this.educationRepository.find();
  }
}
