import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  async createDefaultLevel() {
    const defaultLevel = [
      {
        name: 'Intern',
        status: 1,
      },
      {
        name: 'Fresher',
        status: 1,
      },
      { name: 'Junior', status: 1 },
      { name: 'Middle', status: 1 },
      {
        name: 'Senior',
        status: 1,
      },
      {
        name: 'Lead',
        status: 1,
      },
      {
        name: 'Manager',
        status: 1,
      },
    ];

    await this.levelRepository.save(defaultLevel);
  }

  async create(dto: CreateLevelDto) {
    return this.levelRepository.save({
      name: dto.name,
    });
  }

  async findAll() {
    return this.levelRepository.find({
      where: { status: 1 },
    });
  }
  async findAllByAdmin() {
    return this.levelRepository.find();
  }

  async update(id: number, dto: UpdateLevelDto) {
    const level = await this.levelRepository.findOneBy({ id });
    if (!level) {
      throw new NotFoundException('Cấp bậc không tồn tại');
    }
    const existingLevel = await this.levelRepository.findOneBy({
      name: dto.name,
    });
    if (existingLevel && existingLevel.id !== +id) {
      throw new BadRequestException('Cấp bậc đã tồn tại');
    }
    if (dto.name !== undefined) {
      level.name = dto.name;
    }
    if (dto.status !== undefined) {
      level.status = dto.status;
    }
    return this.levelRepository.save(level);
  }

  async delete(id: number) {
    const level = await this.levelRepository.findOne({
      where: { id },
      relations: { jobs: true },
    });
    if (!level) {
      throw new NotFoundException('Cấp bậc không tồn tại');
    }
    if (level.jobs.length > 0) {
      throw new BadRequestException(
        'Cấp bậc đang được sử dụng trong các công việc',
      );
    }
    return this.levelRepository.remove(level);
  }

  async toggleStatus(id: number) {
    const level = await this.levelRepository.findOneBy({ id });
    if (!level) {
      throw new NotFoundException('Cấp bậc không tồn tại');
    }
    level.status = level.status === 1 ? 0 : 1;
    return this.levelRepository.save(level);
  }
}
