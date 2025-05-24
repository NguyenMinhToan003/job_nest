import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto, LoginCompanyDto } from './dto/create-employer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { UpdateCompanyDto } from './dto/update-employer.dto';
import { AuthService } from 'src/auth/auth.service';
import { SignInResponse } from 'src/types/auth';
import { LocationService } from 'src/location/location.service';
import { ROLE_LIST } from 'src/types/enum';
import { Employer } from './entities/employer.entity';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private readonly employerRepo: Repository<Employer>,
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly locationService: LocationService,
  ) {}

  async register(dto: CreateCompanyDto) {
    const hashPassword = await this.authService.hashPassword(dto.password);
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.EMPLOYER,
      googleId: dto.googleId,
    });
    const employer = this.employerRepo.save({
      id: account.id,
      name: dto.name,
      logo: dto.logo,
    });
    return employer;
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

  async login(dto: LoginCompanyDto): Promise<SignInResponse> {
    const auth = await this.authService.signIn({
      email: dto.email,
      password: dto.password,
    });
    return {
      accessToken: auth.accessToken,
      role: auth.role,
    };
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
