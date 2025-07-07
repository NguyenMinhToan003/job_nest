import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeJob } from './entities/type-job.entity';
import { Repository } from 'typeorm';
import { CreateTypeJobDto } from './dto/create-type-job.dto';
import { UpdateTypeJobDto } from './dto/update-type-job.dto';
import { JOB_STATUS } from 'src/types/enum';

@Injectable()
export class TypeJobService {
  constructor(
    @InjectRepository(TypeJob)
    private typeJobRepository: Repository<TypeJob>,
  ) {}

  async createDefaultTypeJob() {
    const defaultTypeJobs = [
      { name: 'Nhân viên chính thức', status: 1 }, // Full-time permanent
      { name: 'Bán thời gian', status: 1 }, // Part-time
      { name: 'Thời vụ', status: 1 }, // Seasonal/Temporary
      { name: 'Thực tập', status: 1 }, // Internship
      { name: 'Cộng tác viên', status: 1 }, // Freelancer/Contributor
      { name: 'Làm việc từ xa', status: 1 }, // Remote job
      { name: 'Linh hoạt thời gian', status: 1 }, // Flexible
      { name: 'Hợp đồng ngắn hạn', status: 1 }, // Contract-based
    ];

    await this.typeJobRepository.save(defaultTypeJobs);
  }

  async create(dto: CreateTypeJobDto) {
    const existingTypeJob = await this.typeJobRepository.findOneBy({
      name: dto.name,
    });
    if (existingTypeJob) {
      throw new BadRequestException('Loại công việc đã tồn tại');
    }
    const typeJob = this.typeJobRepository.create(dto);
    return this.typeJobRepository.save(typeJob);
  }
  async findAll() {
    return this.typeJobRepository.find();
  }

  async update(id: number, dto: UpdateTypeJobDto) {
    const typeJob = await this.typeJobRepository.findOneBy({ id });
    if (!typeJob) {
      throw new Error('Loại công việc không tồn tại');
    }
    const existingTypeJob = await this.typeJobRepository.findOneBy({
      name: dto.name,
    });
    if (existingTypeJob && existingTypeJob.id !== id) {
      throw new Error('Loại công việc đã tồn tại');
    }
    if (dto.name !== undefined) {
      typeJob.name = dto.name;
    }

    if (dto.status !== undefined) {
      typeJob.status = dto.status;
    }
    return this.typeJobRepository.save(typeJob);
  }

  async delete(id: number) {
    const typeJob = await this.typeJobRepository.findOne({
      where: { id },
      relations: { jobs: true },
    });
    if (!typeJob) {
      throw new NotFoundException('Loại công việc không tồn tại');
    }
    if (
      typeJob.jobs &&
      typeJob.jobs.length > 0 &&
      typeJob.jobs[0].isActive === JOB_STATUS.ACTIVE
    ) {
      throw new BadRequestException(
        'Không thể xóa loại công việc này vì nó đang được sử dụng trong các công việc',
      );
    }
    return this.typeJobRepository.remove(typeJob);
  }
}
