import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateJobDto, JobFilterDto } from './dto/create-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UpdateJobAdminDto, UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}
  async create(companyId: number, createJobDto: CreateJobDto) {
    const job = this.jobRepository.create({
      name: createJobDto.name,
      description: createJobDto.description,
      benefits: createJobDto.benefits,
      requirement: createJobDto.requirement,
      quantity: createJobDto.quantity,
      minSalary: createJobDto.minSalary,
      maxSalary: createJobDto.maxSalary,
      status: 0,
      skills: createJobDto.skills,
      locations: createJobDto.locations,
      createdAt: new Date(),
      experience: createJobDto.experience,
      typeJobs: createJobDto.types,
      expiredAt: new Date(new Date().setDate(new Date().getDate() + 30)),
      company: { id: companyId },
      levels: createJobDto.levels,
    });
    return this.jobRepository.save(job);
  }

  findAll() {
    return this.jobRepository.find({
      relations: {
        experience: true,
        benefits: true,
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
    });
  }

  async remove(id: number) {
    return this.jobRepository.delete(id);
  }

  async findByCompanyId(companyId: number) {
    console.log('companyId', companyId);
    return this.jobRepository.find({
      where: { company: { id: companyId } },
      relations: {
        applyJobs: {
          cv: true,
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
        company: true,
        locations: true,
        skills: true,
        levels: true,
        typeJobs: true,
        majors: true,
        applyJobs: {
          cv: {
            user: true,
          },
        },
      },
    });
  }
  async update(id: number, companyId: number, dto: UpdateJobDto) {
    const job = await this.jobRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
    });
    if (!job) {
      throw new ForbiddenException('You are not allowed to update this job');
    }
    const updatedJob = this.jobRepository.merge(job, {
      name: dto.name,
      description: dto.description,
      benefits: dto.benefits,
      requirement: dto.requirement,
      quantity: dto.quantity,
      minSalary: dto.minSalary,
      isShow: dto.isShow,
      maxSalary: dto.maxSalary,
      skills: dto.skills,
      locations: dto.locations,
      createdAt: new Date(),
      experience: dto.experience,
      typeJobs: dto.types,
      expiredAt: new Date(new Date().setDate(new Date().getDate() + 30)),
      company: { id: companyId },
      levels: dto.levels,
    });
    return this.jobRepository.save(updatedJob);
  }

  async filter(body: JobFilterDto): Promise<{ total: number; data: Job[] }> {
    const where: any = {
      status: 1,
      isShow: 1,
    };
    if (body.id) {
      where.id = body.id;
    }
    if (body.search) {
      where.name = Like(`%${body.search}%`);
    }
    if (body.levels) {
      where.levels = { id: body.levels };
    }
    if (body.experience) {
      where.experience = { id: body.experience };
    }
    if (body.typeJobs) {
      where.typeJobs = { id: body.typeJobs };
    }
    if (body.citys) {
      where.locations = { district: { city: { id: body.citys } } };
    }
    if (body.minSalary && body.maxSalary) {
      where.minSalary = Between(body.minSalary, body.maxSalary);
    } else if (body.minSalary) {
      where.minSalary = MoreThanOrEqual(body.minSalary);
    } else if (body.maxSalary) {
      where.maxSalary = LessThanOrEqual(body.maxSalary);
    }

    const jobs = await this.jobRepository.find({
      where,
      relations: {
        experience: true,
        benefits: true,
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
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      total: jobs.length,
      data: jobs,
    };
  }

  async adminUpdate(id: number, dto: UpdateJobAdminDto) {
    const job = await this.jobRepository.findOne({
      where: { id },
    });
    if (!job) {
      throw new ForbiddenException('You are not allowed to update this job');
    }
    const updatedJob = this.jobRepository.merge(job, {
      status: dto.status,
    });
    return this.jobRepository.save(updatedJob);
  }
}
