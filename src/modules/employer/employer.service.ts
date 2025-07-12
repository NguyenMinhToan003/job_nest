import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AdminFilterCompanyDto,
  CreateCompanyDto,
  FilterEmployerDto,
} from './dto/create-employer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { UpdateCompanyDto } from './dto/update-employer.dto';
import { Employer } from './entities/employer.entity';
import { LocationService } from '../location/location.service';
import { FollowService } from '../follow/follow.service';
import { JobService } from '../job/job.service';
import { UploadService } from 'src/upload/upload.service';
import { EMPLOYER_SUBSCRIPTION_STATUS, PackageType } from 'src/types/enum';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private employerRepo: Repository<Employer>,
    private locationService: LocationService,
    private followService: FollowService,
    private jobService: JobService,
    private readonly uploadService: UploadService,
  ) {}

  async create(accountId: number, dto: CreateCompanyDto): Promise<Employer> {
    const existingEmployer = await this.employerRepo.findOne({
      where: { taxCode: dto.taxCode },
    });
    if (existingEmployer) {
      throw new BadRequestException(
        `Mã số thuế ${dto.taxCode} đã được sử dụng bởi một công ty khác`,
      );
    }
    const create = await this.employerRepo.save({
      id: accountId,
      name: dto.name,
      logo: dto.logo,
      introduction: dto.introduction,
      taxCode: dto.taxCode,
      employeeScale: { id: dto.employeeScaleId },
      businessType: { id: dto.businessTypeId },
      country: { id: dto.countryId },
      phone: dto.phone,
      website: dto.website,
    });

    // await this.employerSubscriptionService.triggerEmployerRegister(accountId);
    return create;
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

  async updated(
    id: number,
    dto: UpdateCompanyDto,
    file: Express.Multer.File | null,
  ) {
    const employer = await this.employerRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        account: true,
        employeeScale: true,
        businessType: true,
        country: true,
      },
    });
    if (dto.password) delete dto.password;
    if (dto.email) delete dto.email;
    if (file) {
      const upload = await this.uploadService.uploadFile([file]);
      dto.logo = upload[0].secure_url;
    }
    return this.employerRepo.save({
      businessType: { id: dto.businessTypeId || employer.businessType.id },
      country: { id: dto.countryId || employer.country.id },
      employeeScale: { id: dto.employeeScaleId || employer.employeeScale.id },
      id: id,
      name: dto.name || employer.name,
      logo: dto.logo || employer.logo,
      introduction: dto.introduction || employer.introduction,
      phone: dto.phone || employer.phone,
      website: dto.website || employer.website,
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
      relations: {
        account: true,
        employeeScale: true,
        businessType: true,
        country: true,
      },
    });
    if (!employer) {
      throw new BadRequestException('Công ty không tồn tại');
    }
    const countFollows =
      await this.followService.countFollowsEmployer(+companyId);
    const locations = await this.locationService.findByCompany(companyId, 1);
    employer.locations = locations;
    const jobIsNotExpired = await this.jobService.filter({
      employerIds: [+companyId],
    });
    return {
      ...employer,
      isFollowed: !!isFollowed,
      jobs: jobIsNotExpired.data,
      countFollows,
    };
  }
  async getMeEmployer(id: number) {
    const employer = await this.employerRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        account: true,
        employeeScale: true,
        businessType: true,
        country: true,
      },
    });
    if (!employer) {
      throw new BadRequestException(' not found');
    }
    employer.account.password = employer.account.password.length.toString();
    return employer;
  }

  async getAllEmployers(query: AdminFilterCompanyDto) {
    const where: any = {};
    if (query.search) {
      where.name = query.search;
    }
    const [items, total] = await this.employerRepo.findAndCount({
      where,
      skip: (+query.page - 1) * 10,
      take: +query.limit || 10,
      relations: {
        account: true,
        employeeScale: true,
        businessType: true,
        country: true,
      },
    });
    const totalPage = Math.ceil(total / (query.limit || 10));
    return {
      items,
      total,
      totalPage,
    };
  }
  async getBanner() {
    const employersBanner = await this.employerRepo.find({
      where: {
        employerSubscriptions: {
          job: { id: IsNull() },
          status: EMPLOYER_SUBSCRIPTION_STATUS.USED,
          endDate: MoreThanOrEqual(new Date()),
          package: {
            type: PackageType.EMPLOYER,
          },
        },
      },
      relations: {
        account: true,
        employeeScale: true,
        businessType: true,
        country: true,
      },
    });
    const result = [];
    for (const employer of employersBanner) {
      const jobsCount = await this.jobService.getCountJobByEmployerId(
        employer.id,
      );
      result.push({
        ...employer,
        jobsCount,
      });
    }
    return result;
  }
  async filterSearch(query: FilterEmployerDto) {
    const where: any = {};
    if (query.search) {
      where.name = query.search;
    }
    if (!query.page) {
      query.page = 1;
    }
    if (query.countryId) {
      where.country = { id: query.countryId };
    }
    if (query.employeeScaleId) {
      where.employeeScale = { id: query.employeeScaleId };
    }
    if (query.businessTypeId) {
      where.businessType = { id: query.businessTypeId };
    }
    const [items, total] = await this.employerRepo.findAndCount({
      where,
      skip: (+query.page - 1) * 10,
      take: +query.limit || 10,
      relations: {
        account: true,
        employeeScale: true,
        businessType: true,
        country: true,
      },
    });
    const totalPage = Math.ceil(total / (query.limit || 10));
    return {
      items,
      total,
      totalPage,
    };
  }
}
