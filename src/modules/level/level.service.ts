import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  async createDefaultLevel() {
    const defaultLevel = [
      { name: 'Internship', description: 'Internship', id: 'internship' },
      { name: 'Fresher', description: 'Fresher', id: 'fresher' },
      { name: 'Junior', description: 'Junior', id: 'junior' },
      { name: 'Mid', description: 'Mid', id: 'mid' },
      { name: 'Senior', description: 'Senior', id: 'senior' },
      { name: 'Lead', description: 'Lead', id: 'lead' },
      { name: 'Manager', description: 'Manager', id: 'manager' },
      { name: 'Director', description: 'Director', id: 'director' },
    ];

    await this.levelRepository.save(defaultLevel);
  }

  async create(dto: CreateLevelDto) {
    const level = this.levelRepository.create(dto);
    return this.levelRepository.save(level);
  }

  async findAll() {
    return this.levelRepository.find();
  }
}
