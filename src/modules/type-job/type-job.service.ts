import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeJob } from './entities/type-job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeJobService {
  constructor(
    @InjectRepository(TypeJob)
    private typeJobRepository: Repository<TypeJob>,
  ) {}

  async createDefaultTypeJob() {
    const defaultTypeJobs = [
      { name: 'Văn phòng', description: 'Văn phòng', status: 1, id: 1 },
      {
        name: 'Nhân viên chính thức',
        description: 'Nhân viên chính thức',
        status: 1,
        id: 2,
      },
      { name: 'Thực tập', description: 'Thực tập', status: 1, id: 3 },
      { name: 'Freelance', description: 'Freelance', status: 1, id: 4 },
      { name: 'Thời vụ', description: 'Thời vụ', status: 1, id: 5 },
    ];

    await this.typeJobRepository.save(defaultTypeJobs);
  }

  async create(dto: TypeJob) {
    const typeJob = this.typeJobRepository.create(dto);
    return this.typeJobRepository.save(typeJob);
  }
  async findAll() {
    return this.typeJobRepository.find();
  }
}
