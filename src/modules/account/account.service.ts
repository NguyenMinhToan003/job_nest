import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}
  create(createAccountDto: CreateAccountDto) {
    return this.accountRepository.save(createAccountDto);
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
    console.log('where', where);
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
      where: { googleId },
      relations: { candidate: true, employer: true },
    });
  }
  async toggleStatusEmployer(id: number) {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: { employer: true },
    });
    if (!account || !account.employer) {
      throw new NotFoundException('Employer not found');
    }
    account.status = account.status === 1 ? 0 : 1;
    return this.accountRepository.save(account);
  }
}
