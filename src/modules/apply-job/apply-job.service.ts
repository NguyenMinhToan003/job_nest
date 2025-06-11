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
import { MatchingWeightService } from '../matching-weight/matching-weight.service';

@Injectable()
export class ApplyJobService {
  constructor(
    @InjectRepository(ApplyJob)
    private applyJobRepository: Repository<ApplyJob>,
    private jobService: JobService,
    private readonly resumeVersionService: ResumeVersionService,
    private readonly matchingWeightService: MatchingWeightService,
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
    return this.applyJobRepository.findOne({ where });
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
    const job = await this.jobService.findOne(param.jobId);
    if (!job) {
      throw new BadRequestException('Công việc không tồn tại');
    } else if (job.employer.id !== companyId) {
      throw new BadRequestException('Bạn không có quyền xem ứng tuyển này');
    }

    console.log(job.matchingWeights); // Log MatchingWeights của công việc

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
          majors: true,
          experiences: true,
          skills: true,
          resume: {
            candidate: true,
          },
        },
      },
    });

    const listAddScore = resumes.map((item) => {
      let matchingScore = 0;
      if (!job.matchingWeights) {
        return {
          ...item,
          matchingScore,
        };
      }

      if (job.matchingWeights.skillWeight) {
        const skillScore = job.skills.filter((jobSkill) =>
          item.resumeVersion.skills.some((skill) => skill.id === jobSkill.id),
        ).length;
        matchingScore += skillScore * job.matchingWeights.skillWeight;
      }

      // if (job.matchingWeights.languageWeight) {
      //   const languageScore = item.resumeVersion.languageResumes.filter((language) =>
      //     job.languageJobs.some((jobLanguage) => jobLanguage.language.id === language.language.id),
      //   ).length;
      //   matchingScore += languageScore * job.matchingWeights.languageWeight;
      // }

      if (job.matchingWeights.educationWeight) {
        const educationScore =
          item.resumeVersion.education.id === job.education.id ? 1 : 0;
        matchingScore += educationScore * job.matchingWeights.educationWeight;
      }

      if (job.matchingWeights.levelWeight) {
        const levelScore = job.levels.filter(
          (jobLevel) => item.resumeVersion.level.id === jobLevel.id,
        ).length;
        matchingScore += levelScore * job.matchingWeights.levelWeight;
      }

      if (job.matchingWeights.majorWeight) {
        const majorScore = job.skills.filter((jobSkill) =>
          item.resumeVersion.majors.some((major) => major.id === jobSkill.id),
        ).length;
        matchingScore += majorScore * job.matchingWeights.majorWeight;
      }

      if (job.matchingWeights.locationWeight) {
        const locationScore = job.locations.some(
          (jobLocation) =>
            item.resumeVersion.district.city.id === jobLocation.district.city.id,
        )
          ? 1
          : 0;
        matchingScore += locationScore * job.matchingWeights.locationWeight;
      }

      console.log('Matching Score:', matchingScore);

      return {
        ...item,
        matchingScore,
      };
    });

    return listAddScore;
  }
}
