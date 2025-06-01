import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';
import { Repository } from 'typeorm';
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
        description: 'Phát triển giao diện website, ứng dụng web hiện đại',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Lập trình Mobile',
        description: 'Phát triển ứng dụng di động trên iOS',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Phát triển Backend',
        description: 'Xây dựng API và xử lý logic phía máy chủ',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Cơ sở dữ liệu',
        description: 'Thiết kế và quản lý hệ thống dữ liệu',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'Khoa học Dữ liệu',
        description: 'Phân tích, xử lý và khai thác dữ liệu lớn',
        field: fields.find((f) => f.name === 'Công nghệ thông tin'),
      },
      {
        name: 'DevOps',
        description: 'Tự động hóa triển khai, CI/CD và vận hành hệ thống',
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
      throw new Error('Chuyên ngành đã tồn tại');
    }
    const major = this.majorRepository.create(dto);
    return this.majorRepository.save(major);
  }

  async findAll() {
    return this.majorRepository.find({ relations: ['field'] });
  }
}
