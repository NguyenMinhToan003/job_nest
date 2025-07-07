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

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  async createDefaultExperience() {
    const defaultExperience = [
      { id: 7, name: 'Không yêu cầu kinh nghiệm' },
      { id: 1, name: 'Dưới 1 năm kinh nghiệm' },
      { id: 2, name: 'Từ 1 đến 3 năm kinh nghiệm' },
      { id: 3, name: 'Từ 3 đến 5 năm kinh nghiệm' },
      { id: 4, name: 'Từ 5 đến 7 năm kinh nghiệm' },
      { id: 5, name: 'Từ 7 đến 10 năm kinh nghiệm' },
      { id: 6, name: 'Trên 10 năm kinh nghiệm' },
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
      where: { id, status: 1 },
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
