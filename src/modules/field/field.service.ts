import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  async createDefaultFields() {
    const defaultFields = [
      {
        name: 'Công nghệ thông tin',
        description: 'Lĩnh vực liên quan đến phát triển phần mềm, phần cứng',
      },
      {
        name: 'Kinh doanh',
        description: 'Quản trị, tài chính, kế toán và các hoạt động thương mại',
      },
      {
        name: 'Giáo dục',
        description: 'Đào tạo, giảng dạy và quản lý giáo dục',
      },
    ];

    const existing = await this.fieldRepository.find();
    if (existing.length === 0) {
      await this.fieldRepository.save(defaultFields);
    }
  }

  async findAll() {
    return this.fieldRepository.find({ relations: { majors: true } });
  }
}
