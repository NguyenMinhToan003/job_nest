import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewJob } from './entities/view-job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ViewJobService {
  constructor(
    @InjectRepository(ViewJob)
    private readonly viewJobRepository: Repository<ViewJob>,
  ) {}
  async viewJob(userId: number, jobId: number) {
    return this.viewJobRepository.save({
      job: { id: jobId },
      candidate: { id: userId },
      viewDate: new Date(),
    });
  }
  async getAllViewJobs(userId: number) {
    return this.viewJobRepository.find({
      where: { candidate: { id: userId } },
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
        viewDate: 'DESC',
      },
    });
  }
}
