import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto, LoginDto } from 'src/account/dto/create-account.dto';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private accountService: AccountService,
  ) {}
  async register(accountDto: CreateAccountDto) {
    const exitsEmail = await this.accountService.findEmail(accountDto.email);
    if (exitsEmail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const account = await this.accountService.create(accountDto);
    return await this.user.save({ id: account.id });
  }

  async login(accountDto: LoginDto) {
    const account = await this.accountService.findEmail(accountDto.email);
    if (!account) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }
    if (account.password !== accountDto.password) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }
    const user = await this.user.findOne({ where: { id: account.id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'Login successful',
      user,
    };
  }
}
