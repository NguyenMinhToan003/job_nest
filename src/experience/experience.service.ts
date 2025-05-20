import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  async createDefaultExperience() {
    const defaultExperience = [
      { name: '1 năm', description: '1 năm', id: 1 },
      { name: '3 năm', description: '3 năm', id: 2 },
      { name: '5 năm', description: '5 năm', id: 3 },
      { name: '7 năm', description: '7 năm', id: 4 },
      { name: '10 năm', description: '10 năm', id: 5 },
      { name: 'Trên 10 năm', description: 'Trên 10 năm', id: 6 },
    ];
    await this.experienceRepository.save(defaultExperience);
  }
  async create(dto: CreateExperienceDto) {
    const experience = this.experienceRepository.create(dto);
    return this.experienceRepository.save(experience);
  }
  async findAll() {
    return this.experienceRepository.find();
  }
}
