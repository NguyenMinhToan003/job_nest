import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-candidate.dto';
import { ROLE_LIST } from 'src/types/enum';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly userRepo: Repository<Candidate>,
    private accountService: AccountService,
    private authService: AuthService,
  ) {}
  async register(dto: CreateUserDto) {
    const hashPassword = await this.authService.hashPassword(dto.password);
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.CANDIDATE,
      googleId: dto.googleId,
    });
    const user = this.userRepo.save({
      id: account.id,
      name: dto.name,
      avatar: dto.avatar,
      phone: dto.phone,
      gender: dto.gender,
    });
    return user;
  }

  async getMe(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        account: true,
        notiSettings: true,
        skills: true,
        saveJobs: true,
        cv: true,
      },
    });
    delete user.account.password;
    delete user.account.googleId;
    return user;
  }
}
