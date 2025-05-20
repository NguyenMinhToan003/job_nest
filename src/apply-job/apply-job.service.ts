import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyJob } from './entities/apply-job.entity';
import { Repository } from 'typeorm';
import { APPLY_JOB_STATUS } from 'src/decorators/customize';
import { CreateApplyJobDto } from './dto/create-apply-job.dto';

@Injectable()
export class ApplyJobService {
  constructor(
    @InjectRepository(ApplyJob)
    private applyJobRepository: Repository<ApplyJob>,
  ) {}

  async applyJob(jobId: number, userId: number, body: CreateApplyJobDto) {
    const checkLastApplyJob = await this.applyJobRepository.findOne({
      where: {
        user: { id: userId },
        job: { id: jobId },
      },
      order: { time: 'DESC' },
    });

    if (!checkLastApplyJob) {
      const applyJob = this.applyJobRepository.create({
        job: { id: jobId },
        user: { id: userId },
        status: APPLY_JOB_STATUS.APPLY,
        time: new Date(),
        viewStatus: 0,
        cvId: body.cvId,
        note: body.note,
        replyTime: null,
        interviewTime: null,
      });
      return this.applyJobRepository.save(applyJob);
    }

    if (checkLastApplyJob.status === APPLY_JOB_STATUS.APPLY) {
      throw new BadRequestException('Bạn đã ứng tuyển công việc này rồi');
    }
    if (checkLastApplyJob.status === APPLY_JOB_STATUS.ACCEPT) {
      throw new BadRequestException('Bạn đã được nhận vào công việc này rồi');
    }
    if (checkLastApplyJob.status === APPLY_JOB_STATUS.REJECT) {
      const currentTime = new Date();
      const replyTime = new Date(checkLastApplyJob.replyTime);
      const diffTime = Math.abs(currentTime.getTime() - replyTime.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        throw new BadRequestException(
          'Bạn đã bị từ chối ứng tuyển công việc này, vui lòng thử lại sau 7 ngày',
        );
      }
    }

    // Cho phép apply lại
    const applyJob = this.applyJobRepository.create({
      job: { id: jobId },
      user: { id: userId },
      status: APPLY_JOB_STATUS.APPLY,
      time: new Date(),
      viewStatus: 0,
      cvId: body.cvId,
      note: body.note,
      replyTime: null,
      interviewTime: null,
    });
    return this.applyJobRepository.save(applyJob);
  }

  async getMe(userId: number) {
    return this.applyJobRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        job: {
          company: true,
          locations: {
            district: {
              city: true,
            },
          },
          skills: true,
          level: true,
          typeJobs: true,
          majors: true,
        },
      },
    });
  }
  async getApplyJobByCompanyId(companyId: number) {
    return this.applyJobRepository.find({
      where: {
        job: { company: { id: companyId } },
      },
      relations: {
        job: {
          company: true,
          locations: {
            district: {
              city: true,
            },
          },
          skills: true,
          level: true,
          typeJobs: true,
          majors: true,
        },
        user: true,
      },
    });
  }
}
