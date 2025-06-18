import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaveJobDto } from './dto/create-save-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveJob } from './entities/save-job.entity';
import { Repository } from 'typeorm';
import { JobService } from 'src/modules/job/job.service';
import { JOB_STATUS } from 'src/types/enum';

@Injectable()
export class SaveJobService {
  constructor(
    @InjectRepository(SaveJob)
    private saveJobRepository: Repository<SaveJob>,
    private jobService: JobService,
  ) {}
  async create(userId: number, createSaveJobDto: CreateSaveJobDto) {
    const checkJob = await this.jobService.findOne(createSaveJobDto.jobId);
    if (
      !checkJob ||
      checkJob.isActive === JOB_STATUS.PENDING ||
      checkJob.isShow === 0
    ) {
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
  async getMe(userId: number, page?: number, limit?: number) {
    if (page && limit) {
      const [items, total] = await this.saveJobRepository.findAndCount({
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
        skip: (page - 1) * limit,
        take: limit,
      });
      const totalPage = Math.ceil(total / limit);
      return {
        items,
        totalPage,
        page,
        limit,
      };
    }
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
  async getRecomended(userId: number) {
    const [items, total] = await this.saveJobRepository.findAndCount({
      where: { id: userId },
      relations: {
        job: {
          employer: true,
          locations: {
            district: {
              city: true,
            },
          },
          skills: true,
          benefits: true,
        },
      },
      order: {
        savedDate: 'DESC',
      },
      take: 10,
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
