import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AdminJobFilterDto,
  CompanyFilterJobDto,
  CreateJobDto,
  JobFilterDto,
  MapDto,
} from './dto/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import {
  Between,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UpdateJobAdminDto, UpdateJobDto } from './dto/update-job.dto';
import { ACCOUNT_STATUS, JOB_STATUS, PackageType } from 'src/types/enum';
import { LanguageJobService } from 'src/modules/language-job/language-job.service';
import { getDistance } from 'geolib';
import { EmployerSubscriptionsService } from 'src/employer_subscriptions/employer_subscriptions.service';
import { UseSubscriptionDto } from 'src/packages/dto/create-package.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private languageJobService: LanguageJobService,
    private readonly employerSubscriptionService: EmployerSubscriptionsService,
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
      isActive: JOB_STATUS.CREATE,
      createdAt: new Date(),
      majors: createJobDto?.majors?.map((id) => ({ id })),
      expiredAt: createJobDto.expiredAt,
      employer: { id: employerId },
      benefits: createJobDto.benefits.map((id) => ({ id })),
      skills: createJobDto?.skills?.map((id) => ({ id })),
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
    return job;
  }

  findAll(filter?: AdminJobFilterDto) {
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
    if (filter.fieldId) {
      where.field = { id: filter.fieldId };
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
        employerSubscription: {
          package: true,
        },
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
        majors: true,
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
      where.isActive = In(filter.isActive);
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
        employer: true,
        matchingWeights: true,
        applyJobs: {
          resumeVersion: {
            resume: {
              candidate: true,
            },
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.jobRepository.findOne({
      where: { id },
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
        majors: {
          field: true,
        },
        matchingWeights: true,
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
    if (dto.minSalary > dto.maxSalary) {
      throw new ForbiddenException(
        'Mức lương tối thiểu không thể lớn hơn mức lương tối đa',
      );
    }
    const job = await this.jobRepository.findOne({
      where: {
        id,
        employer: { id: employerId },
      },
    });
    if (!job) {
      throw new ForbiddenException('Không tìm thấy công việc');
    }
    if (job.isActive === JOB_STATUS.BLOCK) {
      job.isActive = JOB_STATUS.PENDING;
    }
    const updatedJob = this.jobRepository.merge(job, {
      isActive: job.isActive,
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
      expiredAt: dto.expiredAt,
      majors: dto?.majors?.map((id) => ({ id })),
    });
    return this.jobRepository.save(updatedJob);
  }

  async filter(
    body: JobFilterDto,
    accountId?: number,
  ): Promise<{
    total: number;
    data: Job[];
    page?: number;
    limit?: number;
    totalPage?: number;
  }> {
    const where: any = {
      isActive: In([JOB_STATUS.ACTIVE, JOB_STATUS.PENDING]),
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
    if (body.employerIds !== undefined && body.employerIds.length > 0) {
      where.employer = { id: In(body.employerIds) };
    }
    if (body.fieldId) {
      where.majors = { field: { id: body.fieldId } };
    }
    if (body.majorId) {
      where.majors = { id: body.majorId };
    }

    const [items, total] = await this.jobRepository.findAndCount({
      where,
      relations: {
        experience: true,
        benefits: true,
        employer: {
          country: true,
        },
        locations: {
          district: {
            city: true,
          },
        },
        skills: true,
        levels: true,
        education: true,
        majors: {
          field: true,
        },
        languageJobs: {
          language: true,
        },
        typeJobs: true,
        employerSubscription: true,
      },
      order: {
        employerSubscription: {
          endDate: 'DESC',
        },
        createdAt: 'DESC',
      },
      skip: body?.page ? (body?.page - 1) * body?.limit : undefined,
      take: body?.limit ? body?.limit : undefined,
    });
    // them isApplied va isSaved vao tung job
    const jobForAccount = [];
    for (const job of items) {
      let isApplied = undefined;
      let isSaved = undefined;
      let isActiveSubscription = false;
      const employerSubscriptions =
        await this.employerSubscriptionService.getSubscriptionByJobId(job.id);
      if (employerSubscriptions) {
        isActiveSubscription = true;
      }
      if (accountId !== undefined) {
        isApplied = await this.jobRepository.findOne({
          where: {
            id: job.id,
            applyJobs: {
              resumeVersion: { resume: { candidate: { id: accountId } } },
            },
          },
        });
        isSaved = await this.jobRepository.findOne({
          where: {
            id: job.id,
            saveJobs: { candidate: { id: accountId } },
          },
        });
      }

      jobForAccount.push({
        ...job,
        isApplied: isApplied ? true : false,
        isSaved: isSaved ? true : false,
        isActiveSubscription: isActiveSubscription,
      });
    }
    const totalPage = body?.limit ? Math.ceil(total / body?.limit) : 1;

    return {
      total: total,
      data: jobForAccount,
      page: body?.page ? body?.page : 1,
      limit: body?.limit ? body?.limit : total,
      totalPage: totalPage,
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

  async getJobInBanner() {
    return this.jobRepository.find({
      where: {
        isActive: In([JOB_STATUS.ACTIVE, JOB_STATUS.PENDING]),
        isShow: 1,
        expiredAt: MoreThanOrEqual(new Date()),
        employerSubscription: {
          endDate: MoreThanOrEqual(new Date()),
          package: {
            type: In([PackageType.BANNER, PackageType.JOB]),
          },
        },
      },
      relations: {
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
  }

  async getJobInMap(map: MapDto) {
    const { latitude, longitude, radius = 5000 } = map;
    const allJobs = await this.jobRepository.find({
      where: {
        isActive: In([JOB_STATUS.ACTIVE]),
        isShow: 1,
        expiredAt: MoreThanOrEqual(new Date()),
      },
      relations: {
        experience: true,
        benefits: true,
        employer: {
          country: true,
        },
        locations: {
          district: {
            city: true,
          },
        },
        skills: true,
        levels: true,
        education: true,
        languageJobs: {
          language: true,
        },
        typeJobs: true,
      },
    });
    const nearbyJobs = [];
    for (const job of allJobs) {
      for (const location of job.locations) {
        const distanceMeters = getDistance(
          { latitude, longitude },
          { latitude: Number(location.lat), longitude: Number(location.lng) },
        );
        if (distanceMeters <= radius) {
          nearbyJobs.push({
            ...job,
            distanceKm: (distanceMeters / 1000).toFixed(2),
          });
          break;
        }
      }
    }
    return nearbyJobs;
  }

  async requestPublishJob(jobId: number, employerId: number) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId, employer: { id: employerId } },
    });
    if (!job) {
      throw new ForbiddenException('Không tìm thấy công việc');
    }
    const currentDate = new Date();
    const expiredDate = new Date(job.expiredAt);
    if (currentDate > expiredDate) {
      throw new ForbiddenException('Hạn nộp đã hết');
    }
    if (job.isActive === JOB_STATUS.BLOCK) {
      throw new ForbiddenException('Công việc kiểm duyệt không thành công');
    }

    if (job.isActive === JOB_STATUS.ACTIVE) {
      throw new ForbiddenException('Công việc đã được xuất bản');
    }

    if (job.isActive !== JOB_STATUS.CREATE) {
      throw new ForbiddenException(
        'Không thể phát hành công việc ở trạng thái hiện tại',
      );
    }

    job.isActive = JOB_STATUS.PENDING;
    return this.jobRepository.save(job);
  }
  async getCountJobByEmployerId(employerId: number) {
    const countTotal = await this.jobRepository.count({
      where: {
        employer: { id: employerId },
        expiredAt: MoreThanOrEqual(new Date()),
      },
    });
    const countActive = await this.jobRepository.count({
      where: {
        employer: { id: employerId },
        isActive: In([JOB_STATUS.ACTIVE]),
        expiredAt: MoreThanOrEqual(new Date()),
      },
    });
    const countPending = await this.jobRepository.count({
      where: {
        employer: { id: employerId },
        isActive: JOB_STATUS.PENDING,
        expiredAt: MoreThanOrEqual(new Date()),
      },
    });
    const countExpired = await this.jobRepository.count({
      where: {
        employer: { id: employerId },
        expiredAt: LessThan(new Date()),
      },
    });
    return {
      total: countTotal,
      active: countActive,
      pending: countPending,
      expired: countExpired,
    };
  }

  async jobUseSubscription(employerId: number, body: UseSubscriptionDto) {
    await this.employerSubscriptionService.useSubscriptionJob(employerId, {
      jobId: body.jobId,
      packageId: body.packageId,
    });
    const job = await this.jobRepository.findOne({
      where: { id: body.jobId, employer: { id: employerId } },
    });
    if (job && job.isActive === JOB_STATUS.CREATE) {
      job.isActive = JOB_STATUS.PENDING;
    }
    return this.jobRepository.save(job);
  }
}
