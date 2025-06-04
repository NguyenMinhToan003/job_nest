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
      { name: 'ReactJS', major: majorMap['Lập trình Web'] },
      { name: 'NodeJS', major: majorMap['Phát triển Backend'] },
      { name: 'TypeScript', major: majorMap['Lập trình Web'] },
      { name: 'JavaScript', major: majorMap['Lập trình Web'] },
      { name: 'Java', major: majorMap['Lập trình Mobile'] },
      { name: 'Python', major: majorMap['Khoa học Dữ liệu'] },
      { name: 'Ruby', major: majorMap['Phát triển Backend'] },
      { name: 'PHP', major: majorMap['Lập trình Web'] },
      { name: 'C#', major: majorMap['Phát triển Backend'] },
      { name: 'C++', major: majorMap['Phát triển Backend'] },
      { name: 'Go', major: majorMap['DevOps'] },
      { name: 'Swift', major: majorMap['Lập trình Mobile'] },
      { name: 'Kotlin', major: majorMap['Lập trình Mobile'] },
      { name: 'HTML', major: majorMap['Lập trình Web'] },
      { name: 'CSS', major: majorMap['Lập trình Web'] },
      { name: 'SQL', major: majorMap['Cơ sở dữ liệu'] },
      { name: 'NoSQL', major: majorMap['Cơ sở dữ liệu'] },
      { name: 'MongoDB', major: majorMap['Cơ sở dữ liệu'] },
      { name: 'MySQL', major: majorMap['Cơ sở dữ liệu'] },
      { name: 'PostgreSQL', major: majorMap['Cơ sở dữ liệu'] },
      { name: 'Oracle', major: majorMap['Cơ sở dữ liệu'] },
      { name: 'Redis', major: majorMap['DevOps'] },
      { name: 'Elasticsearch', major: majorMap['DevOps'] },
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
    if (existingSkill && existingSkill.id !== id) {
      throw new BadRequestException('Kĩ năng đã tồn tại');
    }

    if (dto.name !== undefined) {
      skill.name = dto.name;
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
}
