import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AdminJobFilterDto,
  CompanyFilterJobDto,
  CreateJobDto,
  JobFilterDto,
} from './dto/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import {
  Between,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UpdateJobAdminDto, UpdateJobDto } from './dto/update-job.dto';
import { JOB_STATUS } from 'src/types/enum';
import { AccountService } from '../account/account.service';
import { LanguageJobService } from 'src/modules/language-job/language-job.service';
import { MatchingWeightService } from 'src/modules/matching-weight/matching-weight.service';
import { BlacklistKeywordService } from 'src/blacklist-keyword/blacklist-keyword.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private accountService: AccountService,
    private languageJobService: LanguageJobService,
    private matchingWeightService: MatchingWeightService,
    private blacklistKeywordService: BlacklistKeywordService,
  ) {}
  async create(employerId: number, createJobDto: CreateJobDto) {
    if (createJobDto.minSalary > createJobDto.maxSalary) {
      throw new ForbiddenException(
        'Mức lương tối thiểu không thể lớn hơn mức lương tối đa',
      );
    }
    const job = await this.jobRepository.save({
      name: createJobDto.name,
      description: createJobDto.description,
      requirement: createJobDto.requirement,
      quantity: createJobDto.quantity,
      minSalary: createJobDto.minSalary,
      maxSalary: createJobDto.maxSalary,
      isActive: JOB_STATUS.PENDING,
      createdAt: new Date(),
      expiredAt: new Date(new Date().setDate(new Date().getDate() + 28)),
      employer: { id: employerId },
      benefits: createJobDto.benefits.map((id) => ({ id })),
      skills: createJobDto.skills.map((id) => ({ id })),
      locations: createJobDto.locations.map((id) => ({ id })),
      experience: { id: createJobDto.experience },
      typeJobs: createJobDto.types.map((id) => ({ id })),
      levels: createJobDto.levels.map((id) => ({ id })),
      education: createJobDto.education ? { id: createJobDto.education } : null,
    });

    if (createJobDto.languages && createJobDto.languages.length > 0) {
      for (const language of createJobDto.languages) {
        await this.languageJobService.create({
          jobId: job.id,
          languageId: language.languageId,
          level: language.level,
        });
      }
    }
    this.matchingWeightService.triggerJobCreate(job.id);
    return job;
  }

  findAll(filter?: AdminJobFilterDto) {
    console.log('filter', filter);
    const where: any = {};
    if (filter.search) {
      where.name = Like(`%${filter.search}%`);
    }
    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }
    if (filter.isExpired !== undefined) {
      where.expiredAt = filter.isExpired
        ? LessThan(new Date())
        : MoreThanOrEqual(new Date());
    }
    if (filter.levels) {
      where.levels = filter.levels.map((level) => ({ id: level }));
    }
    if (filter.experience) {
      where.experience = filter.experience.map((experience) => ({
        id: experience,
      }));
    }
    if (filter.typeJobs) {
      where.typeJobs = filter.typeJobs.map((typeJob) => ({
        id: typeJob,
      }));
    }
    if (filter.citys) {
      where.locations = filter.citys.map((city) => ({
        district: { city: { id: city } },
      }));
    }
    if (filter.benefits) {
      where.benefits = filter.benefits.map((benefit) => ({ id: benefit }));
    }
    if (filter.skills) {
      where.skills = filter.skills.map((skill) => ({ id: skill }));
    }
    if (filter.minSalary && filter.maxSalary) {
      where.minSalary = Between(filter.minSalary, filter.maxSalary);
    } else if (filter.minSalary) {
      where.minSalary = MoreThanOrEqual(filter.minSalary);
    } else if (filter.maxSalary) {
      where.maxSalary = LessThanOrEqual(filter.maxSalary);
    }
    if (filter.employerId) {
      where.employer = { id: filter.employerId };
    }

    return this.jobRepository.find({
      where,
      relations: {
        experience: true,
        benefits: true,
        employer: true,
        locations: {
          district: {
            city: true,
          },
        },
        skills: true,
        levels: true,
        typeJobs: true,
        education: true,
        languageJobs: {
          language: true,
        },
      },
    });
  }

  async remove(employerId: number, id: number) {
    const job = await this.jobRepository.findOne({
      where: {
        id,
        employer: { id: employerId },
      },
    });

    if (!job) {
      throw new ForbiddenException('Không tìm thấy công việc');
    }
    return this.jobRepository.delete(id);
  }

  async findByEmployerId(employerId: number, filter: CompanyFilterJobDto) {
    const where = {
      employer: { id: employerId },
    } as any;

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }
    if (filter.isExpired !== undefined) {
      const currentDate = new Date();
      if (filter.isExpired === 1) {
        where.expiredAt = LessThan(currentDate);
      } else {
        where.expiredAt = MoreThanOrEqual(currentDate);
      }
    }
    return this.jobRepository.find({
      where,
      relations: {
        applyJobs: {
          resumeVersion: {
            resume: {
              candidate: true,
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.jobRepository.findOne({
      where: { id },
      relations: {
        experience: true,
        benefits: true,
        employer: true,
        locations: true,
        skills: true,
        levels: true,
        typeJobs: true,
        education: true,
        languageJobs: {
          language: true,
        },
        matchingWeights: {
          matchingKey: true,
        },
        applyJobs: {
          resumeVersion: {
            resume: {
              candidate: true,
            },
          },
        },
      },
    });
  }
  async update(id: number, employerId: number, dto: UpdateJobDto) {
    const job = await this.jobRepository.findOne({
      where: {
        id,
        employer: { id: employerId },
      },
    });
    if (!job) {
      throw new ForbiddenException('Không tìm thấy công việc');
    }
    const checkContent =
      await this.blacklistKeywordService.checkContentForBlacklist(
        dto.name + dto.description + dto.requirement,
      );
    if (checkContent) {
      throw new ForbiddenException(
        'Công việc vi phạm từ khóa cấm. Vui lòng kiểm tra lại nội dung công việc.',
      );
    }
    if (job.isActive === JOB_STATUS.BLOCK) {
      job.isActive = JOB_STATUS.PENDING;
    }
    console.log(dto);
    const updatedJob = this.jobRepository.merge(job, {
      name: dto.name,
      description: dto.description,
      requirement: dto.requirement,
      quantity: dto.quantity,
      minSalary: dto.minSalary,
      maxSalary: dto.maxSalary,
      benefits: dto.benefits.map((id) => ({ id })),
      skills: dto.skills.map((id) => ({ id })),
      locations: dto.locations.map((id) => ({ id })),
      experience: { id: dto.experience },
      typeJobs: dto.types.map((id) => ({ id })),
      levels: dto.levels.map((id) => ({ id })),
      education: { id: dto.education },
    });
    return this.jobRepository.save(updatedJob);
  }

  async filter(
    body: JobFilterDto,
    accountId?: number,
  ): Promise<{ total: number; data: Job[] }> {
    const where: any = {
      isActive: JOB_STATUS.ACTIVE,
      isShow: 1,
      expiredAt: MoreThanOrEqual(new Date()),
    };
    if (body.id) {
      where.id = body.id;
    }
    if (body.search) {
      where.name = Like(`%${body.search}%`);
    }
    if (body.levels) {
      where.levels = body.levels.map((level) => ({ id: level }));
    }
    if (body.experience) {
      where.experience = body.experience.map((experience) => ({
        id: experience,
      }));
    }
    if (body.typeJobs) {
      where.typeJobs = body.typeJobs.map((typeJob) => ({
        id: typeJob,
      }));
    }
    if (body.citys) {
      where.locations = body.citys.map((city) => ({
        district: { city: { id: city } },
      }));
    }
    if (body.benefits) {
      where.benefits = body.benefits.map((benefit) => ({ id: benefit }));
    }
    if (body.skills) {
      where.skills = body.skills.map((skill) => ({ id: skill }));
    }
    if (body.minSalary && body.maxSalary) {
      where.minSalary = Between(body.minSalary, body.maxSalary);
    } else if (body.minSalary) {
      where.minSalary = MoreThanOrEqual(body.minSalary);
    } else if (body.maxSalary) {
      where.maxSalary = LessThanOrEqual(body.maxSalary);
    }
    if (body.employerId) {
      where.employer = { id: body.employerId };
    }

    const jobs = await this.jobRepository.find({
      where,
      relations: {
        experience: true,
        benefits: true,
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
      order: {
        createdAt: 'DESC',
      },
    });
    console.log(accountId, 'accountId');
    if (accountId === undefined) {
      return {
        total: jobs.length,
        data: jobs,
      };
    }
    // them isApplied va isSaved vao tung job
    const jobForAccount = [];
    for (const job of jobs) {
      const isApplied = await this.jobRepository.findOne({
        where: {
          id: job.id,
          applyJobs: {
            resumeVersion: { resume: { candidate: { id: accountId } } },
          },
        },
      });
      const isSaved = await this.jobRepository.findOne({
        where: {
          id: job.id,
          saveJobs: { candidate: { id: accountId } },
        },
      });

      jobForAccount.push({
        ...job,
        isApplied: !!isApplied,
        isSaved: !!isSaved,
      });
    }
    return {
      total: jobForAccount.length,
      data: jobForAccount,
    };
  }

  async adminUpdate(id: number, dto: UpdateJobAdminDto) {
    const job = await this.jobRepository.findOne({
      where: { id },
    });
    if (!job) {
      throw new ForbiddenException('Không tìm thấy công việc');
    }
    const updatedJob = this.jobRepository.merge(job, {
      isActive: dto.isActive,
    });
    return this.jobRepository.save(updatedJob);
  }
  async toggleIsShow(employerId: number, jobId: number) {
    const job = await this.jobRepository.findOne({
      where: { id: +jobId, employer: { id: +employerId } },
    });
    if (!job) {
      throw new ForbiddenException('Bạn không có quyền sửa công việc này');
    }
    // check han nop
    const currentDate = new Date();
    const expiredDate = new Date(job.expiredAt);
    if (currentDate > expiredDate) {
      throw new ForbiddenException('Hạn nộp đã hết');
    }
    if (job.isShow === 1) {
      job.isShow = 0;
    } else {
      job.isShow = 1;
    }
    return this.jobRepository.save(job);
  }
}
