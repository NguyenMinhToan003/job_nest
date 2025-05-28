import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-employer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCompanyDto } from './dto/update-employer.dto';
import { Employer } from './entities/employer.entity';
import { LocationService } from '../location/location.service';
import { FollowService } from '../follow/follow.service';
import { JobService } from '../job/job.service';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private employerRepo: Repository<Employer>,
    private locationService: LocationService,
    private followService: FollowService,
    private jobService: JobService,
  ) {}

  async create(accountId: number, dto: CreateCompanyDto): Promise<Employer> {
    return this.employerRepo.save({
      id: accountId,
      name: dto.name,
      logo: dto.logo,
    });
  }
  async findAll() {
    return this.employerRepo.find({
      relations: {
        account: true,
      },
    });
  }

  async findOne(id: number) {
    const employer = await this.employerRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        account: true,
      },
    });
    if (!employer) {
      throw new BadRequestException(' not found');
    }
    delete employer.account.password;
    return employer;
  }

  async updated(id: number, dto: UpdateCompanyDto) {
    const employer = await this.employerRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!employer) {
      throw new BadRequestException(' not found');
    }
    return this.employerRepo.save({
      ...employer,
      ...dto,
    });
  }

  async getCompanyDetail(companyId: number, accountId?: number) {
    const isFollowed = accountId
      ? await this.followService.findOne({
          employer: { id: +companyId },
          candidate: { id: +accountId },
        })
      : null;
    const employer = await this.employerRepo.findOne({
      where: {
        id: +companyId,
      },
    });
    if (!employer) {
      throw new BadRequestException('Công ty không tồn tại');
    }
    const locations = await this.locationService.findByCompany(companyId, 1);
    employer.locations = locations;
    const jobIsNotExpired = await this.jobService.filter({
      employerId: +companyId,
    });
    console.log('jobIsNotExpired', jobIsNotExpired);
    return {
      ...employer,
      isFollowed: !!isFollowed,
      jobs: jobIsNotExpired.data,
    };
  }
}
