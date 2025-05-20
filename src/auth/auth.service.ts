import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from 'src/account/account.service';
import { SignInResponse } from 'src/types/auth';
import { AuthDto } from './dto/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}

  async signIn(dto: AuthDto): Promise<SignInResponse> {
    console.log('dto', dto);
    const account = await this.accountService.findEmail(dto.email);
    if (!account) {
      throw new UnauthorizedException('tai khoan khong ton tai');
    }
    const payload = { sub: account.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken: accessToken,
      role: account.role,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(
    userPassword: string,
    storedHashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(userPassword, storedHashPassword);
  }
}
