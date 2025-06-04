import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Repository } from 'typeorm';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JOB_STATUS } from 'src/types/enum';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  async createDefaultExperience() {
    const defaultExperience = [
      { name: '1 năm', id: 1 },
      { name: '3 năm', id: 2 },
      { name: '5 năm', id: 3 },
      { name: '7 năm', id: 4 },
      { name: '10 năm', id: 5 },
      { name: 'Trên 10 năm', id: 6 },
    ];
    await this.experienceRepository.save(defaultExperience);
  }
  async create(dto: CreateExperienceDto) {
    const existingExperience = await this.experienceRepository.findOneBy({
      name: dto.name,
    });
    if (existingExperience) {
      throw new BadRequestException('Kinh nghiệm đã tồn tại');
    }
    const experience = this.experienceRepository.create({
      name: dto.name,
    });
    return this.experienceRepository.save(experience);
  }
  async findAll() {
    return this.experienceRepository.find({
      where: { status: 1 },
    });
  }
  async findAllAdmin() {
    return this.experienceRepository.find();
  }
  async update(id: number, dto: UpdateExperienceDto) {
    const experience = await this.experienceRepository.findOneBy({ id });
    if (!experience) {
      throw new NotFoundException('Kinh nghiệm không tồn tại');
    }
    const existingExperience = await this.experienceRepository.findOneBy({
      name: dto.name,
    });
    if (existingExperience && existingExperience.id !== id) {
      throw new BadRequestException('Kinh nghiệm đã tồn tại');
    }
    if (dto.name !== undefined) {
      experience.name = dto.name;
    }
    if (dto.status !== undefined) {
      experience.status = dto.status;
    }
    return this.experienceRepository.save(experience);
  }
  async delete(id: number) {
    const experience = await this.experienceRepository.findOne({
      where: { id, status: JOB_STATUS.ACTIVE },
      relations: { jobs: true },
    });
    if (!experience) {
      throw new NotFoundException('Kinh nghiệm không tồn tại');
    }
    if (experience.jobs.length > 0) {
      throw new BadRequestException(
        'Kinh nghiệm đang được sử dụng trong các công việc',
      );
    }
    return this.experienceRepository.delete(experience);
  }
}
