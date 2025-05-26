import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JOB_STATUS } from 'src/types/enum';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async createDefaultSkill() {
    const defaultSkills = [
      { name: 'ReactJS', description: 'ReactJS', status: 1, id: 1 },
      { name: 'NodeJS', description: 'NodeJS', status: 1, id: 2 },
      { name: 'TypeScript', description: 'TypeScript', status: 1, id: 3 },
      { name: 'JavaScript', description: 'JavaScript', status: 1, id: 4 },
      { name: 'Java', description: 'Java', status: 1, id: 5 },
      { name: 'Python', description: 'Python', status: 1, id: 6 },
      { name: 'Ruby', description: 'Ruby', status: 1, id: 7 },
      { name: 'PHP', description: 'PHP', status: 1, id: 8 },
      { name: 'C#', description: 'C#', status: 1, id: 9 },
      { name: 'C++', description: 'C++', status: 1, id: 10 },
      { name: 'Go', description: 'Go', status: 1, id: 11 },
      { name: 'Swift', description: 'Swift', status: 1, id: 12 },
      { name: 'Kotlin', description: 'Kotlin', status: 1, id: 13 },
      { name: 'HTML', description: 'HTML', status: 1, id: 14 },
      { name: 'CSS', description: 'CSS', status: 1, id: 15 },
      { name: 'SQL', description: 'SQL', status: 1, id: 16 },
      { name: 'NoSQL', description: 'NoSQL', status: 1, id: 17 },
      { name: 'MongoDB', description: 'MongoDB', status: 1, id: 18 },
      { name: 'MySQL', description: 'MySQL', status: 1, id: 19 },
      { name: 'PostgreSQL', description: 'PostgreSQL', status: 1, id: 20 },
      { name: 'Oracle', description: 'Oracle', status: 1, id: 21 },
      { name: 'Redis', description: 'Redis', status: 1, id: 22 },
      {
        name: 'Elasticsearch',
        description: 'Elasticsearch',
        status: 1,
        id: 23,
      },
    ];

    await this.skillRepository.save(defaultSkills);
  }

  async create(dto: CreateSkillDto) {
    const existingSkill = await this.skillRepository.findOneBy({
      name: dto.name,
    });
    if (existingSkill) {
      throw new BadRequestException('Kĩ năng đã tồn tại');
    }
    const skill = this.skillRepository.create(dto);
    return this.skillRepository.save(skill);
  }

  async findAll() {
    return this.skillRepository.find({
      where: { status: 1 },
    });
  }

  async findAllByAdmin() {
    return this.skillRepository.find();
  }

  async update(id: number, dto: UpdateSkillDto) {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException('Kĩ năng không tồn tại');
    }
    const existingSkill = await this.skillRepository.findOneBy({
      name: dto.name,
    });

    if (existingSkill && existingSkill.id !== id) {
      throw new BadRequestException('Kĩ năng đã tồn tại');
    }
    if (dto.name !== undefined) {
      skill.name = dto.name;
    }
    if (dto.description !== undefined) {
      skill.description = dto.description;
    }
    if (dto.status !== undefined) {
      skill.status = dto.status;
    }
    return this.skillRepository.save(skill);
  }

  async delete(id: number) {
    const skill = await this.skillRepository.findOne({
      where: { id, status: JOB_STATUS.ACTIVE },
      relations: {
        jobs: true,
      },
    });
    if (skill.jobs && skill.jobs.length > 0) {
      throw new BadRequestException(
        'Không thể xóa kỹ năng này vì nó đang được sử dụng trong các công việc',
      );
    }
    if (!skill) {
      throw new BadRequestException('Kĩ năng không tồn tại');
    }
    return this.skillRepository.remove(skill);
  }
}
