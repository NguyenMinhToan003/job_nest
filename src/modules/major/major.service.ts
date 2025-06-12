import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';
import { Not, Repository } from 'typeorm';
import { CreateMajorDto } from './dto/create-major.dto';
import { FieldService } from '../field/field.service';

@Injectable()
export class MajorService {
  constructor(
    @InjectRepository(Major)
    private majorRepository: Repository<Major>,
    private fieldService: FieldService,
  ) {}

  async createDefaultMajors(): Promise<Major[]> {
    const existing = await this.majorRepository.find();
    if (existing.length > 0) return existing;

    const fields = await this.fieldService.findAll();

    const defaultMajors = [
      {
        name: 'Lập trình Web',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Lập trình Mobile',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Phát triển Backend',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Cơ sở dữ liệu',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Khoa học Dữ liệu',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'DevOps',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
    ];

    return this.majorRepository.save(defaultMajors);
  }

  async findOne(where: any) {
    return this.majorRepository.findOne({ where });
  }

  async create(dto: CreateMajorDto) {
    const existingMajor = await this.majorRepository.findOne({
      where: { name: dto.name },
    });
    if (existingMajor) {
      throw new BadRequestException('Chuyên ngành đã tồn tại');
    }
    const major = this.majorRepository.create({
      name: dto.name,
      field: { id: dto.fieldId },
    });
    return this.majorRepository.save(major);
  }

  async findAll() {
    return this.majorRepository.find({ relations: ['field'] });
  }
  async update(id: number, dto: CreateMajorDto) {
    const major = await this.majorRepository.findOne({ where: { id } });
    if (!major) {
      throw new BadRequestException('Chuyên ngành không tồn tại');
    }
    const existingMajor = await this.majorRepository.findOne({
      where: { name: dto.name, id: Not(id) },
    });
    if (existingMajor) {
      throw new BadRequestException('Chuyên ngành đã tồn tại');
    }
    major.name = dto.name;
    return this.majorRepository.save(major);
  }

  async remove(id: number) {
    const major = await this.majorRepository.findOne({ where: { id } });
    if (!major) {
      throw new BadRequestException('Chuyên ngành không tồn tại');
    }
    return this.majorRepository.remove(major);
  }

  async getOne(id: number) {
    const major = await this.majorRepository.findOne({
      where: { id },
      relations: {
        field: true,
        skills: true,
      },
    });
    if (!major) {
      throw new BadRequestException('Chuyên ngành không tồn tại');
    }
    return major;
  }

  async getByJobId(jobId: number) {
    return this.majorRepository.find({
      where: {
        skills: {
          jobs: {
            id: jobId,
          },
        },
      },
    });
  }
}
