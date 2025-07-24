import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { ACCOUNT_STATUS, ROLE_LIST } from 'src/types/enum';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    const existingAccount = await this.accountRepository.findOne({
      where: { email: createAccountDto.email },
    });
    if (existingAccount) {
      throw new NotFoundException(
        `Tài khoản ${createAccountDto.email} đã tồn tại`,
      );
    }
    const create = await this.accountRepository.create(createAccountDto);
    return this.accountRepository.save(create);
  }
  async delete(id: number) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Tài khoản với ID ${id} không tồn tại`);
    }
    return this.accountRepository.remove(account);
  }
  findAll() {
    return this.accountRepository.find();
  }
  findOne(where: any) {
    return this.accountRepository.findOne({ where });
  }
  findEmail(email: string) {
    return this.accountRepository.findOne({ where: { email } });
  }
  findById(id: number) {
    return this.accountRepository.findOne({ where: { id } });
  }
  findCompanyId(companyId: number) {
    return this.accountRepository.findOne({
      where: { id: companyId },
      relations: { employer: true },
    });
  }
  findCandidateWhere(where: any) {
    return this.accountRepository.find({
      where,
      relations: { candidate: true },
    });
  }
  findEmployerWhere(where: any) {
    return this.accountRepository.find({
      where,
      relations: { employer: true },
    });
  }
  update(id: number, dto: CreateAccountDto) {
    const account = this.accountRepository.findOne({
      where: { id },
    });
    if (!account) {
      throw new Error('Account not found');
    }
    return this.accountRepository.update(id, dto);
  }
  async getAccountByGoogleId(googleId: string) {
    return this.accountRepository.findOne({
      // where: { googleId },
      relations: { candidate: true, employer: true },
    });
  }
  async changeStatus(id: number, status: ACCOUNT_STATUS) {
    const account = await this.accountRepository.findOne({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    account.status = status;
    return this.accountRepository.save(account);
  }
  async getDashboardData() {
    const employers = await this.accountRepository.count({
      where: {
        role: ROLE_LIST.EMPLOYER,
      },
    });
    const candidates = await this.accountRepository.count({
      where: {
        role: ROLE_LIST.CANDIDATE,
      },
    });
    return {
      employers,
      candidates,
    };
  }
}
