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
import { MajorService } from '../major/major.service';
import { Major } from '../major/entities/major.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    private majorService: MajorService,
  ) {}

  async createDefaultSkills() {
    const majors = await this.majorService.createDefaultMajors();
    const majorMap = Object.fromEntries(majors.map((m) => [m.name, m]));

    const defaultSkills = [
      { name: 'ReactJS', major: majorMap['Lập trình Web'], id: 1 },
      { name: 'NodeJS', major: majorMap['Phát triển Backend'], id: 2 },
      { name: 'TypeScript', major: majorMap['Lập trình Web'], id: 3 },
      { name: 'JavaScript', major: majorMap['Lập trình Web'], id: 4 },
      { name: 'Java', major: majorMap['Lập trình Mobile'], id: 5 },
      { name: 'Python', major: majorMap['Khoa học Dữ liệu'], id: 6 },
      { name: 'Ruby', major: majorMap['Phát triển Backend'], id: 7 },
      { name: 'PHP', major: majorMap['Lập trình Web'], id: 8 },
      { name: 'C#', major: majorMap['Phát triển Backend'], id: 9 },
      { name: 'C++', major: majorMap['Phát triển Backend'], id: 10 },
      { name: 'Go', major: majorMap['DevOps'], id: 11 },
      { name: 'Swift', major: majorMap['Lập trình Mobile'], id: 12 },
      { name: 'Kotlin', major: majorMap['Lập trình Mobile'], id: 13 },
      { name: 'HTML', major: majorMap['Lập trình Web'], id: 14 },
      { name: 'CSS', major: majorMap['Lập trình Web'], id: 15 },
      { name: 'SQL', major: majorMap['Cơ sở dữ liệu'], id: 16 },
      { name: 'NoSQL', major: majorMap['Cơ sở dữ liệu'], id: 17 },
      { name: 'MongoDB', major: majorMap['Cơ sở dữ liệu'], id: 18 },
      { name: 'MySQL', major: majorMap['Cơ sở dữ liệu'], id: 19 },
      { name: 'PostgreSQL', major: majorMap['Cơ sở dữ liệu'], id: 20 },
      { name: 'Oracle', major: majorMap['Cơ sở dữ liệu'], id: 21 },
      { name: 'Redis', major: majorMap['DevOps'], id: 22 },
      { name: 'Elasticsearch', major: majorMap['DevOps'], id: 23 },
    ].map((skill) => ({
      name: skill.name,

      status: JOB_STATUS.ACTIVE,
      major: skill.major,
    }));

    await this.skillRepository.save(defaultSkills);
  }

  async create(dto: CreateSkillDto) {
    const existingSkill = await this.skillRepository.findOneBy({
      name: dto.name,
    });
    if (existingSkill) {
      throw new BadRequestException('Kĩ năng đã tồn tại');
    }
    const skill = this.skillRepository.create({
      name: dto.name,
      status: JOB_STATUS.ACTIVE,
      major: { id: dto.majorId },
    });
    return this.skillRepository.save(skill);
  }

  async findAll() {
    return this.skillRepository.find({
      where: { status: JOB_STATUS.ACTIVE },
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
    if (existingSkill && existingSkill.id !== +id) {
      throw new BadRequestException('Tên kĩ năng đã tồn tại');
    }

    if (dto.name !== undefined) {
      skill.name = dto.name;
    }
    if (dto.status !== undefined) {
      skill.status = dto.status;
    }
    if (dto.majorId !== undefined) {
      skill.major = { id: dto.majorId } as Major;
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
    if (!skill) {
      throw new BadRequestException('Kĩ năng không tồn tại');
    }
    if (skill.jobs && skill.jobs.length > 0) {
      throw new BadRequestException(
        'Không thể xóa kỹ năng này vì nó đang được sử dụng trong các công việc',
      );
    }
    return this.skillRepository.remove(skill);
  }

  async paginate(page: number, limit: number) {
    const [items, total] = await this.skillRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        major: {
          field: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
    const totalPages = Math.ceil(total / limit);
    return {
      items,
      total,
      page,
      totalPages,
      limit,
    };
  }
}
