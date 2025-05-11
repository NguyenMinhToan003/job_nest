import { Injectable } from '@nestjs/common';
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
  findEmail(email: string) {
    return this.accountRepository.findOne({ where: { email } });
  }
  findById(id: number) {
    return this.accountRepository.findOne({ where: { id } });
  }
}
