import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyJob } from './entities/apply-job.entity';
import { Repository } from 'typeorm';
import {
  CreateApplyJobDto,
  GetApplyByStatusDto,
  GetApplyJobByJobIdDto,
} from './dto/create-apply-job.dto';
import { APPLY_JOB_STATUS } from 'src/types/enum';
import { JobService } from 'src/modules/job/job.service';
import { ResumeVersionService } from 'src/modules/resume-version/resume-version.service';
import { Job } from '../job/entities/job.entity';

@Injectable()
export class ApplyJobService {
  constructor(
    @InjectRepository(ApplyJob)
    private applyJobRepository: Repository<ApplyJob>,
    private jobService: JobService,
    private readonly resumeVersionService: ResumeVersionService,
  ) {}

  async applyJob(jobId: number, candidateId: number, body: CreateApplyJobDto) {
    const checkPer = await this.resumeVersionService.viewResume(
      candidateId,
      +body.resumeId,
    );
    if (!checkPer) {
      throw new UnauthorizedException('Bạn không có quyền sử dụng Hồ sơ này');
    }
    const getApply = await this.getApply(candidateId, jobId);

    if (getApply) {
      throw new BadRequestException({
        message: 'Bạn đã ứng tuyển công việc này trước đó',
        applyId: getApply.id,
      });
    }

    return this.applyJobRepository.save({
      job: { id: jobId },
      resumeVersion: { id: checkPer.id },
      status: APPLY_JOB_STATUS.PENDING,
      applyTime: new Date(),
      viewStatus: 0,
      note: body.note,
    });
  }

  async getApply(candidateId: number, jobId: number) {
    return await this.applyJobRepository.findOne({
      where: {
        job: { id: +jobId },
        resumeVersion: {
          resume: {
            candidate: {
              id: +candidateId,
            },
          },
        },
      },
    });
  }

  async unApply(candidateId: number, jobId: number) {
    const getApply = await this.getApply(candidateId, jobId);
    if (!getApply) {
      throw new BadRequestException('Công việc chưa ứng tuyển');
    }
    return this.applyJobRepository.remove(getApply);
  }

  async getMe(candidateId: number) {
    return this.applyJobRepository.find({
      where: {
        resumeVersion: {
          resume: {
            candidate: { id: candidateId },
          },
        },
      },
      relations: {
        job: {
          employer: true,
          locations: {
            district: {
              city: true,
            },
          },
          skills: true,
          levels: true,
          typeJobs: true,
        },
        resumeVersion: true,
      },
      order: {
        applyTime: 'DESC',
      },
    });
  }

  async findOne(where: any) {
    return this.applyJobRepository.findOne({
      where,
    });
  }

  async getApplyJobByCompanyId(companyId: number) {
    return this.applyJobRepository.find({
      where: {
        job: { employer: { id: companyId } },
      },
      relations: {
        job: {
          employer: true,
          locations: {
            district: {
              city: true,
            },
          },
          skills: true,
          levels: true,
          typeJobs: true,
        },
        resumeVersion: true,
      },
    });
  }

  async markView(applyId: number) {
    const applyJob = await this.applyJobRepository.findOne({
      where: { id: applyId },
    });
    if (!applyJob) {
      throw new BadRequestException('Ứng tuyển không tồn tại');
    }
    if (applyJob.viewStatus === 1) return;
    applyJob.viewStatus = 1; // Đánh dấu đã xem
    return this.applyJobRepository.save(applyJob);
  }

  async getMeByStatus(candidateId: number, param: GetApplyByStatusDto) {
    return this.applyJobRepository.find({
      where: {
        resumeVersion: {
          resume: {
            candidate: { id: candidateId },
          },
        },
        status: param.status,
      },
      relations: {
        job: {
          employer: true,
          locations: {
            district: {
              city: true,
            },
          },
          skills: true,
          levels: true,
          typeJobs: true,
        },
        resumeVersion: true,
      },
    });
  }
  async getApplyJobByJobId(companyId: number, param: GetApplyJobByJobIdDto) {
    // Lấy thông tin công việc
    const job = await this.jobService.findOne(param.jobId);
    if (!job) {
      throw new BadRequestException('Công việc không tồn tại');
    } else if (job.employer.id !== companyId) {
      throw new BadRequestException('Bạn không có quyền xem ứng tuyển này');
    }

    console.log(job.matchingWeights); // Log MatchingWeights của công việc

    // Lấy danh sách ứng tuyển
    const resumes = await this.applyJobRepository.find({
      where: {
        job: { id: +param.jobId },
      },
      relations: {
        resumeVersion: {
          level: true,
          district: {
            city: true,
          },
          languageResumes: true,
          education: true,
          skills: true,
          resume: {
            candidate: true,
          },
        },
      },
    });

    const listAddScore = resumes.map((item) => {
      return {
        ...item,
        matchingScore: 0,
      };
    });
    return listAddScore;
  }
}
