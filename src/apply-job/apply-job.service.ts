import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { JobService } from 'src/job/job.service';
import { CvService } from 'src/cv/cv.service';
import dayjs from 'dayjs';

@Injectable()
export class ApplyJobService {
  constructor(
    @InjectRepository(ApplyJob)
    private applyJobRepository: Repository<ApplyJob>,
    private jobService: JobService,
    private cvService: CvService,
  ) {}

  async applyJob(jobId: number, userId: number, body: CreateApplyJobDto) {
    const checkPermission = await this.cvService.findCvByUserIdAndCvId(
      userId,
      body.cvId,
    );
    if (!checkPermission) {
      throw new NotFoundException('Lỗi sử dụng CV');
    }
    const checkJob = await this.jobService.findOne(jobId);
    if (!checkJob || checkJob.isActive === 0 || checkJob.isShow === 0) {
      throw new NotFoundException('Công việc không tồn tại');
    }
    if (checkJob.expiredAt < new Date()) {
      throw new BadRequestException('Công việc đã hết hạn');
    }
    const checkLastApplyJob = await this.applyJobRepository.findOne({
      where: {
        cv: { id: body.cvId },
        job: { id: +jobId },
      },
      order: { time: 'DESC' },
    });
    if (!checkLastApplyJob) {
      const applyJob = this.applyJobRepository.create({
        job: { id: jobId },
        cv: { id: body.cvId },
        status: APPLY_JOB_STATUS.APPLY,
        time: new Date(),
        viewStatus: 0,
        username: body.username,
        phone: body.phone,
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
      const time = dayjs(checkLastApplyJob.replyTime);
      const timeNow = dayjs(new Date());
      const diff = time.diff(timeNow, 'day');
      if (diff > 1) {
        throw new BadRequestException(
          'Bạn đã từ chối công việc này, vui lòng ứng tuyển lại sau 3 ngày',
        );
      }
    }

    // Cho phép apply lại
    const applyJob = this.applyJobRepository.create({
      job: { id: jobId },
      cv: { id: body.cvId },
      status: APPLY_JOB_STATUS.APPLY,
      time: new Date(),
      viewStatus: 0,
      username: body.username,
      phone: body.phone,
      note: body.note,
      replyTime: null,
      interviewTime: null,
    });
    return this.applyJobRepository.save(applyJob);
  }

  async getMe(userId: number) {
    return this.applyJobRepository.find({
      where: {
        cv: { user: { id: userId } },
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
          levels: true,
          typeJobs: true,
          majors: true,
        },
        cv: true,
      },
      order: {
        time: 'DESC',
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
          levels: true,
          typeJobs: true,
          majors: true,
        },
        cv: true,
      },
    });
  }

  async getMeByStatus(userId: number, param: GetApplyByStatusDto) {
    return this.applyJobRepository.find({
      where: {
        cv: { user: { id: userId } },
        status: param.status,
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
          levels: true,
          typeJobs: true,
          majors: true,
        },
        cv: true,
      },
    });
  }
  async getApplyJobByJobId(companyId: number, param: GetApplyJobByJobIdDto) {
    const job = await this.jobService.findOne(param.jobId);
    if (!job) {
      throw new BadRequestException('Công việc không tồn tại');
    } else if (job.company.id !== companyId) {
      throw new BadRequestException('Bạn không có quyền xem ứng tuyển này');
    }
    return this.applyJobRepository.find({
      where: {
        job: { id: +param.jobId },
      },
      relations: {
        job: true,
        cv: {
          user: true,
        },
      },
    });
  }
}
