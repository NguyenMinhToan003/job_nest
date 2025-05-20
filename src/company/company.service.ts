import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto, LoginCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { ROLE_LIST } from 'src/decorators/customize';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthService } from 'src/auth/auth.service';
import { SignInResponse } from 'src/types/auth';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {}

  async register(dto: CreateCompanyDto) {
    const hashPassword = await this.authService.hashPassword(dto.password);
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.COMPANY,
      googleId: dto.googleId,
    });
    const company = this.companyRepository.save({
      id: account.id,
      name: dto.name,
      logo: dto.logo,
    });
    return company;
  }
  async findAll() {
    return this.companyRepository.find({
      relations: {
        account: true,
      },
    });
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        account: true,
      },
    });
    if (!company) {
      throw new Error('Company not found');
    }
    delete company.account.password;
    return company;
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
    const company = await this.companyRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!company) {
      throw new BadRequestException('Company not found');
    }
    return this.companyRepository.save({
      ...company,
      ...dto,
    });
  }

  async getCompanyDetail(companyId: number) {
    const company = await this.companyRepository.findOne({
      where: {
        id: companyId,
      },
      relations: {
        jobs: {
          level: true,
          benefits: true,
          locations: {
            district: {
              city: true,
            },
          },
          typeJobs: true,
          skills: true,
        },
        locations: {
          district: {
            city: true,
          },
        },
      },
    });
    if (!company) {
      throw new BadRequestException('Company not found');
    }
    return company;
  }
}
