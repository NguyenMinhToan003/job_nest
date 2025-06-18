import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewJob } from './entities/view-job.entity';
import { Repository } from 'typeorm';
import { JobService } from 'src/modules/job/job.service';

@Injectable()
export class ViewJobService {
  constructor(
    @InjectRepository(ViewJob)
    private readonly viewJobRepository: Repository<ViewJob>,
    private readonly jobService: JobService,
  ) {}
  async viewJob(userId: number, jobId: number) {
    return this.viewJobRepository.save({
      job: { id: jobId },
      candidate: { id: userId },
      viewDate: new Date(),
    });
  }
  async paginateViewJob(userId: number, page: number, limit: number) {
    if (!page || !limit) {
      return await this.viewJobRepository.find({
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
    const [items, total] = await this.viewJobRepository.findAndCount({
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
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalPage = Math.ceil(total / limit);
    return {
      items,
      total,
      totalPage,
      page,
    };
  }
  async recommendedViewJob(userId: number) {
    const [items] = await this.viewJobRepository.findAndCount({
      where: { candidate: { id: userId } },
      relations: {
        job: {
          employer: true,
          locations: {
            district: {
              city: true,
            },
          },
          skills: true,
        },
      },
      order: {
        viewDate: 'DESC',
      },
      take: 20,
    });
    if (items.length === 0) {
      return [];
    }
    const listSkills = [];
    items.forEach((item) => {
      item.job.skills.forEach((skill) => {
        if (!listSkills.includes(skill.id)) {
          listSkills.push(skill.id);
        }
      });
    });
    const listJobsInSaveJob = items.map((item) => item.job.id);
    const recomendedJobs = await this.jobService.filter(
      {
        skills: listSkills,
      } as any,
      userId,
    );
    const filteredJobs = recomendedJobs.data.filter(
      (job) => !listJobsInSaveJob.includes(job.id),
    );
    return filteredJobs;
  }
}
