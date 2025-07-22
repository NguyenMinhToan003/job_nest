import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyJob } from './entities/apply-job.entity';
import {
  AddTagResumeDto,
  CreateApplyJobDto,
  GetApplyByStatusDto,
  GetApplyByTagResumeDto,
  GetApplyJobByJobIdDto,
  SendMailToCandidateDto,
  UpdateApplyJobStatusDto,
} from './dto/create-apply-job.dto';
import { APPLY_JOB_STATUS } from 'src/types/enum';
import { ResumeVersionService } from 'src/modules/resume-version/resume-version.service';
import { MajorService } from '../major/major.service';
import { Job } from '../job/entities/job.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { NotiAccountService } from '../noti-account/noti-account.service';
import { In, Not, Repository } from 'typeorm';
import { TagResume } from '../tag-resume/entities/tag-resume.entity';

@Injectable()
export class ApplyJobService {
  constructor(
    @InjectRepository(ApplyJob)
    private applyJobRepository: Repository<ApplyJob>,
    private readonly resumeVersionService: ResumeVersionService,
    private readonly majorService: MajorService,
    private readonly mailerService: MailerService,
    private readonly notiAccountService: NotiAccountService,
  ) {}

  // Hàm tính điểm khớp chung
  private calculateMatchingScore(
    applyJob: ApplyJob,
    job: Job,
    normalize: boolean = false,
    detailed: boolean = false,
  ) {
    let matchingScore = 0;
    const score = {
      skillScore: 0,
      educationScore: 0,
      levelScore: 0,
      majorScore: 0,
      locationScore: 0,
      languageScore: 0,
      total: 0,
    };
    const matchingFields = detailed
      ? {
          skill: [],
          education: [],
          level: [],
          major: [],
          location: [],
          language: [],
        }
      : null;

    if (!job.matchingWeights) {
      return detailed
        ? { matchingScore, score, matchingFields }
        : { matchingScore };
    }

    const { matchingWeights } = job;

    // Tính điểm kỹ năng
    if (matchingWeights.skillWeight && job.skills.length > 0) {
      const skillScore = job.skills.filter((jobSkill) =>
        applyJob.resumeVersion.skills.some((skill) => skill.id === jobSkill.id),
      );
      if (detailed) matchingFields.skill = skillScore;
      const skillValue = normalize
        ? (skillScore.length / job.skills.length) * matchingWeights.skillWeight
        : skillScore.length * matchingWeights.skillWeight;
      matchingScore += skillValue;
      if (detailed) score.skillScore = skillValue;
    }

    // Tính điểm học vấn
    if (matchingWeights.educationWeight) {
      const educationScore =
        applyJob.resumeVersion.education.id === job?.education?.id ? 1 : 0;
      if (detailed)
        matchingFields.education = [applyJob.resumeVersion.education];
      const educationValue = educationScore * matchingWeights.educationWeight;
      matchingScore += educationValue;
      if (detailed) score.educationScore = educationValue;
    }

    // Tính điểm cấp bậc
    if (matchingWeights.levelWeight) {
      const levelScore = job.levels.filter(
        (jobLevel) => applyJob.resumeVersion.level.id === jobLevel.id,
      );
      if (detailed) matchingFields.level = levelScore;
      const levelValue = levelScore.length * matchingWeights.levelWeight;
      matchingScore += levelValue;
      if (detailed) score.levelScore = levelValue;
    }

    // Tính điểm chuyên ngành
    if (matchingWeights.majorWeight) {
      const majorScore = job.majors.filter((jobMajor) =>
        applyJob.resumeVersion.majors.some((major) => major.id === jobMajor.id),
      );
      if (detailed) matchingFields.major = majorScore;
      const majorValue = normalize
        ? (majorScore.length / job.majors.length || 0) *
          matchingWeights.majorWeight
        : majorScore.length * matchingWeights.majorWeight;
      matchingScore += majorValue;
      if (detailed) score.majorScore = majorValue;
    }

    // Tính điểm địa điểm
    if (matchingWeights.locationWeight) {
      const locationScore = job.locations.filter(
        (jobLocation) =>
          applyJob.resumeVersion.district.city.id ===
          jobLocation.district.city.id,
      );
      if (detailed) matchingFields.location = locationScore;
      const locationValue =
        locationScore.length * matchingWeights.locationWeight;
      matchingScore += locationValue;
      if (detailed) score.locationScore = locationValue;
    }

    // Tính điểm ngôn ngữ
    if (matchingWeights.languageWeight) {
      const languageScore = job.languageJobs.filter((jobLanguage) =>
        applyJob.resumeVersion.languageResumes.some(
          (language) => language.languageId === jobLanguage.language.id,
        ),
      );
      if (detailed) matchingFields.language = languageScore;
      const languageValue = normalize
        ? (languageScore.length / job.languageJobs.length) *
          matchingWeights.languageWeight
        : languageScore.length * matchingWeights.languageWeight;
      matchingScore += languageValue;
      if (detailed) score.languageScore = languageValue;
    }

    if (detailed) score.total = matchingScore;

    return detailed
      ? { matchingScore, score, matchingFields }
      : { matchingScore };
  }

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
      status: APPLY_JOB_STATUS.PROCESSING,
      applyTime: new Date(),
      viewStatus: 0,
      candidateNote: body.candidateNote,
      phone: body.phone,
      email: body.email,
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
    if (getApply.status !== APPLY_JOB_STATUS.PROCESSING) {
      throw new BadRequestException(
        'Bạn không thể hủy ứng tuyển công việc này vì đã có trạng thái khác ngoài "Đang xử lý"',
      );
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
    applyJob.viewStatus = 1;
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
  async getApplyJobByCandidateId(candidateId: number) {
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

  async getApplyJobIsNotDeletedByResumeId(resumeId: number) {
    return this.applyJobRepository.find({
      where: {
        resumeVersion: { resume: { id: resumeId } },
        status: Not(APPLY_JOB_STATUS.PROCESSING),
      },
    });
  }

  async getApplyJobByJobId(companyId: number, param: GetApplyJobByJobIdDto) {
    const where = {
      job: { employer: { id: companyId } },
    } as Record<string, any>;
    if (param.jobId) {
      where.job = { id: +param.jobId };
    }
    const resumes = await this.applyJobRepository.find({
      where,
      relations: {
        tagResumes: true,
        resumeVersion: {
          level: true,
          district: {
            city: true,
          },
          languageResumes: true,
          education: true,
          majors: true,
          skills: true,
          resume: {
            candidate: true,
          },
        },
        job: {
          skills: true,
          levels: true,
          education: true,
          majors: true,
          locations: { district: { city: true } },
          languageJobs: { language: true },
          matchingWeights: true,
        },
      },
    });

    const listWithScores = resumes.map((item) => {
      const { matchingScore } = this.calculateMatchingScore(
        item,
        item.job,
        true,
      );
      return { ...item, matchingScore };
    });

    return listWithScores.sort((a, b) => b.matchingScore - a.matchingScore);
  }

  async getResumeVersionForJob(companyId: number, applyId: number) {
    const resumeVersion = await this.applyJobRepository.findOne({
      where: { id: applyId },
      relations: {
        tagResumes: true,
        job: {
          employer: true,
          locations: {
            district: { city: true },
          },
          skills: true,
          levels: true,
          typeJobs: true,
          matchingWeights: true,
          education: true,
          languageJobs: {
            language: true,
          },
          majors: true,
        },
        resumeVersion: {
          level: true,
          district: {
            city: true,
          },
          languageResumes: {
            language: true,
          },
          education: true,
          majors: true,
          skills: true,
          resume: {
            candidate: true,
          },
        },
      },
    });

    if (!resumeVersion) {
      throw new BadRequestException('Hồ sơ không tồn tại');
    }
    const job = resumeVersion.job;
    if (job.employer.id !== companyId) {
      throw new UnauthorizedException('Bạn không có quyền xem ứng tuyển này');
    }

    const majors = await this.majorService.getByJobId(job.id);
    const { matchingScore, score, matchingFields } =
      this.calculateMatchingScore(resumeVersion, job, true, true);

    // Lấy danh sách để tính xếp hạng
    const allResumes = await this.getApplyJobByJobId(companyId, {
      jobId: job.id,
    });
    const rank =
      allResumes.findIndex(
        (item) => item.resumeVersion.id === resumeVersion.resumeVersion.id,
      ) + 1;
    return {
      ...resumeVersion,
      majors,
      score,
      matchingScore,
      matchingFields,
      rank,
    };
  }
  async updateStatus(
    employerId: number,
    applyId: number,
    dto: UpdateApplyJobStatusDto,
  ) {
    const applyJob = await this.applyJobRepository.findOne({
      where: {
        id: applyId,
        job: { employer: { id: employerId } },
      },
    });
    if (!applyJob) {
      throw new BadRequestException('Không tìm thấy đơn ứng tuyển');
    }
    if (applyJob.status === APPLY_JOB_STATUS.HIRED) {
      throw new BadRequestException(
        'Không thể cập nhật trạng thái ứng tuyển đã được phê duyệt',
      );
    }
    applyJob.status = dto.status;
    return this.applyJobRepository.save(applyJob);
  }

  async addTag(employerId: number, applyId: number, body: AddTagResumeDto) {
    const applyJob = await this.applyJobRepository.findOne({
      where: {
        id: applyId,
        job: { employer: { id: employerId } },
      },
      relations: {
        tagResumes: true,
      },
    });
    if (!applyJob) {
      throw new BadRequestException('Không tìm thấy đơn ứng tuyển');
    }
    const tag = applyJob.tagResumes || [];
    for (const tagId of body.tagIds) {
      if (!tag.some((t) => t.id === tagId)) {
        const newTag = { id: tagId };
        tag.push(newTag as TagResume);
      }
    }
    applyJob.tagResumes = tag;
    return this.applyJobRepository.save(applyJob);
  }

  async removeTag(employerId: number, applyId: number, body: AddTagResumeDto) {
    const applyJob = await this.applyJobRepository.findOne({
      where: {
        id: applyId,
        job: { employer: { id: employerId } },
      },
      relations: {
        tagResumes: true,
      },
    });
    if (!applyJob) {
      throw new BadRequestException('Không tìm thấy đơn ứng tuyển');
    }
    const tag = applyJob.tagResumes || [];
    for (const tagId of body.tagIds) {
      const index = tag.findIndex((t) => t.id === tagId);
      if (index !== -1) {
        tag.splice(index, 1);
      }
    }
    applyJob.tagResumes = tag;
    return this.applyJobRepository.save(applyJob);
  }

  async feedback(employerId: number, applyId: number, feedback: string) {
    if (!feedback || feedback.trim() === '') {
      throw new BadRequestException('Phản hồi không được để trống');
    }
    const applyJob = await this.applyJobRepository.findOne({
      where: {
        id: applyId,
        job: { employer: { id: employerId } },
      },
    });
    if (!applyJob) {
      throw new BadRequestException('Không tìm thấy đơn ứng tuyển');
    }
    applyJob.feedback = feedback;
    return this.applyJobRepository.save(applyJob);
  }

  async sendMailToCandidate(
    employerId: number,
    applyId: number,
    dto: SendMailToCandidateDto,
  ) {
    const applyJob = await this.applyJobRepository.findOne({
      where: {
        id: applyId,
        job: { employer: { id: employerId } },
      },
      relations: {
        job: {
          employer: true,
        },
        resumeVersion: {
          resume: {
            candidate: true,
          },
        },
      },
    });
    if (!applyJob) {
      throw new BadRequestException('Không tìm thấy đơn ứng tuyển');
    }

    const sendMail = await this.mailerService.sendMail({
      to: applyJob.email,
      subject: dto.subject || 'Thông báo từ nhà tuyển dụng',
      template: 'send-mail-to-candidate',
      context: {
        candidateName: applyJob.resumeVersion.resume.candidate.name,
        content: dto.content,
        jobTitle: applyJob.job.name,
        employerName: applyJob.job.employer.name,
      },
    });
    this.notiAccountService.create(employerId, {
      content: `
        ${dto.content}
        <br>
        <strong>Vị trí công việc:</strong> ${applyJob.job.name}
        <br>
        <strong>Nhà tuyển dụng:</strong> ${applyJob.job.employer.name}
        <br>
        <strong>Thời gian gửi:</strong> ${new Date().toLocaleString()}
        <strong>gmail nhan</strong> ${applyJob.email}
      `,
      link: 'tong-quat-ho-so/thong-bao',
      title: dto.subject || 'Thông báo từ nhà tuyển dụng',
      type: 'SEND_MAIL_TO_CANDIDATE',
      receiverAccountId: applyJob.resumeVersion.resume.candidate.id,
    });
    return {
      message: 'Gửi email thành công',
      sendMail,
    };
  }
  async getApplyJobDashboard(employerId: number) {
    const totalApply = await this.applyJobRepository.count({
      where: {
        job: { employer: { id: employerId } },
      },
    });
    const notViewed = await this.applyJobRepository.count({
      where: {
        job: { employer: { id: employerId } },
        viewStatus: 0,
      },
    });
    const penddingApply = await this.applyJobRepository.count({
      where: {
        job: { employer: { id: employerId } },
        status: APPLY_JOB_STATUS.PROCESSING,
      },
    });
    const hiredApply = await this.applyJobRepository.count({
      where: {
        job: { employer: { id: employerId } },
        status: APPLY_JOB_STATUS.HIRED,
      },
    });
    const interviewApply = await this.applyJobRepository.count({
      where: {
        job: { employer: { id: employerId } },
        status: APPLY_JOB_STATUS.INTERVIEWING,
      },
    });
    const qualifiedApply = await this.applyJobRepository.count({
      where: {
        job: { employer: { id: employerId } },
        status: APPLY_JOB_STATUS.QUALIFIED,
      },
    });

    return {
      totalApply,
      notViewed,
      penddingApply,
      hiredApply,
      interviewApply,
      qualifiedApply,
    };
  }
  async getApplyJobByTags(employerId: number, dto: GetApplyByTagResumeDto) {
    const applyJobs = await this.applyJobRepository.find({
      where: {
        tagResumes: {
          id: dto.tagIds ? In(dto.tagIds) : Not(In([])),
        },
        job: {
          employer: { id: employerId },
          id: dto.jobId ? +dto.jobId : undefined,
        },
        status: dto.status || undefined,
      },
      relations: {
        tagResumes: true,
        resumeVersion: {
          level: true,
          district: {
            city: true,
          },
          languageResumes: true,
          education: true,
          majors: true,
          skills: true,
          resume: {
            candidate: true,
          },
        },
        job: {
          skills: true,
          levels: true,
          education: true,
          majors: true,
          locations: { district: { city: true } },
          languageJobs: { language: true },
          matchingWeights: true,
        },
      },
    });
    const listWithScores = applyJobs.map((item) => {
      const { matchingScore } = this.calculateMatchingScore(
        item,
        item.job,
        true,
      );
      return { ...item, matchingScore };
    });

    return listWithScores.sort((a, b) => b.matchingScore - a.matchingScore);
  }
}
