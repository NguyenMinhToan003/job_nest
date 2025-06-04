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
      { name: 'Cao đẳng', id: 1, weight: 1 },
      { name: 'Đại học', id: 2, weight: 2 },
      { name: 'Thạc sĩ', id: 3, weight: 3 },
      { name: 'Tiến sĩ', id: 4, weight: 4 },
      { name: 'Khác', id: 5, weight: 5 },
    ];
    await this.educationRepository.save(defaultEducation);
  }

  async getAllEducation() {
    return this.educationRepository.find();
  }
}
