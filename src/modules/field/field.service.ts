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
      },
      {
        name: 'Kinh doanh',
      },
      {
        name: 'Giáo dục',
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

  async getFieldByJobId(jobId: number) {
    return this.fieldRepository.find({
      where: {
        majors: {
          skills: {
            jobs: { id: jobId },
          },
        },
      },
      relations: { majors: true },
    });
  }
}
