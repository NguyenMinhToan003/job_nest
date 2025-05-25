import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from 'src/modules/account/account.service';
import { AuthDto } from './dto/dto';
import { PROVIDER_LIST, ROLE_LIST } from 'src/types/enum';
import { CandidateService } from 'src/modules/candidate/candidate.service';
import { EmployerService } from 'src/modules/employer/employer.service';
import { CreateUserDto } from 'src/modules/candidate/dto/create-candidate.dto';
import { CreateCompanyDto } from 'src/modules/employer/dto/create-employer.dto';
import { AuthTokenService } from 'src/modules/auth_token/auth_token.service';
import { CreateAuthTokenDto } from 'src/modules/auth_token/dto/create-auth_token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private accountService: AccountService,
    private candidateService: CandidateService,
    private employerService: EmployerService,
    private authTokenService: AuthTokenService,
  ) {}

  async signIn(res, dto: AuthDto) {
    console.log('dto', dto);
    const account = await this.accountService.findEmail(dto.email);
    if (!account) {
      throw new UnauthorizedException('tai khoan khong ton tai');
    }
    const payload = { sub: account.id };
    const accessToken = await this.jwtService.signAsync(payload);
    // gan token vao cookie
    res.cookie(this.configService.get<string>('JWT_COOKIE_NAME'), accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
    });
    res.status(200).json({ role: account.role });
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

  async loginGoogle(req, res, role: ROLE_LIST) {
    if (!req.user) {
      throw new UnauthorizedException('Google authentication failed');
    }
    const { profile, accessToken, refreshToken } = req.user;
    const account = await this.accountService.getAccountByGoogleId(profile.id);
    if (account) {
      const accessTokenLocal = await this.jwtService.signAsync({
        sub: account.id,
      });
      res.cookie(
        this.configService.get<string>('JWT_COOKIE_NAME'),
        accessTokenLocal,
        {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
        },
      );
      this.authTokenService.update(account.id, PROVIDER_LIST.GOOGLE, {
        accessToken,
        refreshToken,
      } as CreateAuthTokenDto);
      res.redirect(
        `${this.configService.get<string>('FRONTEND_URL')}/login-success`,
      );
      return;
    }
    if (role === ROLE_LIST.CANDIDATE) {
      const candidate = await this.registerCandidate(
        {
          email: profile._json.email,
          password: null,
          googleId: profile._json.sub,
          name: profile._json.name,
          avatar: profile._json.picture || null,
          gender: null,
        } as CreateUserDto,
        true,
      );
      const accessToken = await this.jwtService.signAsync({
        sub: candidate.id,
      });
      res.cookie(
        this.configService.get<string>('JWT_COOKIE_NAME'),
        accessToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
        },
      );
      res.redirect(
        `${this.configService.get<string>('FRONTEND_URL')}/login-success`,
      );
      return;
    }
    if (role === ROLE_LIST.EMPLOYER) {
      const employer = await this.registerEmployer(
        {
          email: profile.email,
          password: null,
          googleId: profile.id,
          name: profile.displayName,
          logo: profile.photos?.[0]?.value || null,
        } as CreateCompanyDto,
        true,
      );
      const accessToken = await this.jwtService.signAsync({
        sub: employer.id,
      });
      res.cookie(
        this.configService.get<string>('JWT_COOKIE_NAME'),
        accessToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
        },
      );
      res.redirect(
        `${this.configService.get<string>('FRONTEND_URL')}/login-success`,
      );
    }
  }
  async registerCandidate(dto: CreateUserDto, isGoogle?: boolean) {
    const hashPassword = !isGoogle
      ? await this.hashPassword(dto.password)
      : null;
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.CANDIDATE,
      googleId: dto.googleId,
    });
    const candidate = this.candidateService.create(account.id, dto);
    return candidate;
  }
  async registerEmployer(dto: CreateCompanyDto, isGoogle?: boolean) {
    const hashPassword = !isGoogle
      ? await this.hashPassword(dto.password)
      : null;
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.EMPLOYER,
      googleId: dto.googleId,
    });
    const employer = this.employerService.create(account.id, dto);
    return employer;
  }
}
