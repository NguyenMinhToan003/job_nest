import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { AuthService } from 'src/auth/auth.service';
import { ROLE_LIST } from 'src/decorators/customize';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private accountService: AccountService,
    private authService: AuthService,
  ) {}
  async register(dto: CreateUserDto) {
    const hashPassword = await this.authService.hashPassword(dto.password);
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.USER,
      googleId: dto.googleId,
    });
    const user = this.userRepo.save({
      id: account.id,
      name: dto.name,
      avatar: dto.avatar,
    });
    return user;
  }

  async login(accountDto: LoginUserDto) {
    const account = await this.accountService.findEmail(accountDto.email);
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    const isMatch = await this.authService.validatePassword(
      accountDto.password,
      account.password,
    );
    if (!isMatch) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.authService.signIn(account);
    return {
      token,
      user: {
        id: account.id,
        email: account.email,
        role: account.role,
      },
    };
  }
}
