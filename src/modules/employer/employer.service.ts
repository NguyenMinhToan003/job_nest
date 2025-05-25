import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-employer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCompanyDto } from './dto/update-employer.dto';
import { Employer } from './entities/employer.entity';
import { LocationService } from '../location/location.service';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private readonly employerRepo: Repository<Employer>,
    private readonly locationService: LocationService,
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

  async getCompanyDetail(companyId: number) {
    const employer = await this.employerRepo.findOne({
      where: {
        id: +companyId,
      },
      relations: {
        jobs: {
          levels: true,
          benefits: true,
          locations: {
            district: {
              city: true,
            },
          },
          typeJobs: true,
          skills: true,
        },
      },
    });
    if (!employer) {
      throw new BadRequestException('Công ty không tồn tại');
    }
    const locations = await this.locationService.findByCompany(companyId, 1);
    employer.locations = locations;
    return employer;
  }
}
