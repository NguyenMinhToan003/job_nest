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

    // Tính điểm phù hợp cho từng ứng viên
    const resumesWithScore = await Promise.all(
      resumes.map(async (applyJob) => {
        const resumeVersion = applyJob.resumeVersion;
        const matchingScore = await this.calculateMatchingScore(
          job,
          resumeVersion,
        );
        return {
          ...applyJob,
          matchingScore, // Thêm điểm phù hợp vào kết quả
        };
      }),
    );

    // Sắp xếp theo điểm phù hợp (giảm dần)
    return resumesWithScore.sort((a, b) => b.matchingScore - a.matchingScore);
  }

  private async calculateMatchingScore(
    job: any,
    resumeVersion: any,
  ): Promise<number> {
    const weights = job.matchingWeights; // Lấy MatchingWeights từ job

    let totalScore = 0;

    for (const weight of weights) {
      const fieldName = weight.matchingKey.fieldName;
      const score = this.calculateFieldScore(fieldName, resumeVersion, job);
      totalScore += score * weight.weight;
    }

    // Điểm đã được chuẩn hóa theo trọng số (tổng trọng số = 1), chuyển về thang 100
    return Math.round(totalScore * 100);
  }

  private calculateFieldScore(
    fieldName: string,
    resumeVersion: any,
    job: any,
  ): number {
    if (fieldName === 'skill') {
      const candidateSkills =
        (resumeVersion.skills || []).map((s) => s.name) || []; // Default to empty array if undefined
      const jobSkills = (job.skills || []).map((s) => s.name) || [];
      const matchedSkills = candidateSkills.filter((skill) =>
        jobSkills.includes(skill),
      );
      return jobSkills.length > 0
        ? matchedSkills.length / jobSkills.length
        : 0.5;
    }
    if (fieldName === 'experience') {
      const candidateExp = parseInt(resumeVersion.experience?.name) || 0;
      const jobExp = parseInt(job.experience?.name) || 0;
      return jobExp > 0 ? Math.min(candidateExp / jobExp, 1) : 0.5;
    }
    if (fieldName === 'education') {
      const candidateEdu = resumeVersion.education?.weight || 0;
      const jobEdu = job.education?.weight || 0;
      return candidateEdu >= jobEdu ? 1 : candidateEdu > 0 ? 0.5 : 0;
    }
    if (fieldName === 'language') {
      const candidateLangs =
        (resumeVersion.languageResumes || []).map((l) => l.name) || [];
      const jobLangs = (job.languages || []).map((l) => l.name) || [];
      const matchedLangs = candidateLangs.filter((lang) =>
        jobLangs.includes(lang),
      );
      return jobLangs.length > 0 ? matchedLangs.length / jobLangs.length : 0.5;
    }
    return 0;
  }
}
