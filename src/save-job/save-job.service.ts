import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaveJobDto } from './dto/create-save-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveJob } from './entities/save-job.entity';
import { Repository } from 'typeorm';
import { JobService } from 'src/job/job.service';

@Injectable()
export class SaveJobService {
  constructor(
    @InjectRepository(SaveJob)
    private saveJobRepository: Repository<SaveJob>,
    private jobService: JobService,
  ) {}
  async create(userId: number, createSaveJobDto: CreateSaveJobDto) {
    const checkJob = await this.jobService.findOne(createSaveJobDto.jobId);
    if (!checkJob || checkJob.isActive === 0 || checkJob.isShow === 0) {
      throw new BadRequestException('Công việc không tồn tại');
    }
    if (checkJob.expiredAt < new Date()) {
      throw new BadRequestException('Công việc đã hết hạn');
    }
    return this.saveJobRepository.save({
      id: userId,
      job: { id: createSaveJobDto.jobId },
      savedDate: new Date(),
    });
  }
  getMe(userId: number) {
    return this.saveJobRepository.find({
      where: { id: userId },
      relations: {
        job: {
          employer: true,
          locations: {
            district: {
              city: true,
            },
          },
        },
      },
      order: {
        savedDate: 'DESC',
      },
    });
  }
}
