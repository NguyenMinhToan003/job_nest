import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyJob } from './entities/apply-job.entity';
import { Repository } from 'typeorm';
import {
  ApplyJobWithNewCvDto,
  CreateApplyJobDto,
  GetApplyByStatusDto,
  GetApplyJobByJobIdDto,
} from './dto/create-apply-job.dto';
import { APPLY_JOB_STATUS } from 'src/types/enum';
import { JobService } from 'src/modules/job/job.service';
import { CvService } from 'src/modules/cv/cv.service';
import { ApplyJobValidatorService } from './validate-apply.service';

@Injectable()
export class ApplyJobService {
  constructor(
    @InjectRepository(ApplyJob)
    private applyJobRepository: Repository<ApplyJob>,
    private jobService: JobService,
    private cvService: CvService,
    private readonly applyJobValidatorService: ApplyJobValidatorService,
  ) {}

  async applyJob(jobId: number, userId: number, body: CreateApplyJobDto) {
    await this.applyJobValidatorService.validateApplyPermission(
      jobId,
      userId,
      body.cvId,
    );
    const applyJob = this.applyJobRepository.create({
      job: { id: jobId },
      cv: { id: body.cvId },
      status: APPLY_JOB_STATUS.PENDING,
      applyTime: new Date(),
      viewStatus: 0,
      // username: body.username,
      // phone: body.phone,
      note: body.note,
    });
    return this.applyJobRepository.save(applyJob);
  }

  async applyJobWithNewCv(
    cv: Express.Multer.File,
    jobId: number,
    userId: number,
    body: ApplyJobWithNewCvDto,
  ) {
    await this.applyJobValidatorService.validateApplyJobExistence(
      jobId,
      userId,
    );
    const cvNew = await this.cvService.create(cv, userId);
    const applyJob = this.applyJobRepository.create({
      job: { id: jobId },
      cv: { id: cvNew.id },
      status: APPLY_JOB_STATUS.PENDING,
      applyTime: new Date(),
      viewStatus: 0,
      // username: body.username,
      // phone: body.phone,
      note: body.note,
    });
    return this.applyJobRepository.save(applyJob);
  }

  async getMe(userId: number) {
    return this.applyJobRepository.find({
      where: {
        cv: { candidate: { id: userId } },
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
        cv: true,
      },
      order: {
        applyTime: 'DESC',
      },
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
        cv: true,
      },
    });
  }

  async getMeByStatus(userId: number, param: GetApplyByStatusDto) {
    return this.applyJobRepository.find({
      where: {
        cv: { candidate: { id: userId } },
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
        cv: true,
      },
    });
  }
  async getApplyJobByJobId(companyId: number, param: GetApplyJobByJobIdDto) {
    const job = await this.jobService.findOne(param.jobId);
    if (!job) {
      throw new BadRequestException('Công việc không tồn tại');
    } else if (job.employer.id !== companyId) {
      throw new BadRequestException('Bạn không có quyền xem ứng tuyển này');
    }
    return this.applyJobRepository.find({
      where: {
        job: { id: +param.jobId },
      },
      relations: {
        job: true,
        cv: {
          candidate: true,
        },
      },
    });
  }
}
