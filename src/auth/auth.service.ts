import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountService } from 'src/modules/account/account.service';
import { AuthDto } from './dto/dto';
import { ROLE_LIST } from 'src/types/enum';
import { CandidateService } from 'src/modules/candidate/candidate.service';
import { EmployerService } from 'src/modules/employer/employer.service';
import { CreateUserDto } from 'src/modules/candidate/dto/create-candidate.dto';
import { CreateCompanyDto } from 'src/modules/employer/dto/create-employer.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private accountService: AccountService,
    private candidateService: CandidateService,
    private employerService: EmployerService,
    private readonly uploadService: UploadService,
  ) {}

  async signIn(res, dto: AuthDto) {
    const account = await this.accountService.findEmail(dto.email);
    if (!account) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    if (account.password === null) {
      throw new UnauthorizedException(
        'Tài khoản này đã đăng nhập bằng Google, không thể đăng nhập bằng mật khẩu',
      );
    }

    const isPasswordValid = await this.validatePassword(
      dto.password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }
    const payload = { sub: account.id };
    const accessToken = await this.jwtService.signAsync(payload);
    // gan token vao cookie
    res.cookie(this.configService.get<string>('JWT_COOKIE_NAME'), accessToken, {
      httpOnly: true,
      secure: process.env.PRODUCTION === 'true' ? true : false,
      sameSite: process.env.PRODUCTION === 'true' ? 'none' : 'lax',
      maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
    });
    res.status(HttpStatus.OK).json({
      role: account.role,
      accessToken: accessToken,
    });
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
    const { profile } = req.user;
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
          secure: process.env.PRODUCTION === 'true' ? true : false,
          sameSite: process.env.PRODUCTION === 'true' ? 'none' : 'lax',
          maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
        },
      );
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
        null,
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
          secure: process.env.COOKIE_SECURE === 'true',
          sameSite: 'strict',
          maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 1000,
        },
      );
      res.redirect(
        `${this.configService.get<string>('FRONTEND_URL')}/login-success`,
      );
      return;
    }
  }
  async registerCandidate(
    dto: CreateUserDto,
    avatarFile: Express.Multer.File,
    isGoogle?: boolean,
  ) {
    const hashPassword = !isGoogle
      ? await this.hashPassword(dto.password)
      : null;
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.CANDIDATE,
    });
    if (avatarFile) {
      const uploadAvatar = await this.uploadService.uploadFile([avatarFile]);
      if (uploadAvatar && uploadAvatar.length > 0) {
        dto.avatar = uploadAvatar[0].secure_url;
      }
    } else {
      dto.avatar = null;
    }
    try {
      const candidate = await this.candidateService.create(account.id, dto);
      return candidate;
    } catch (error: any) {
      await this.accountService.delete(account.id);
      throw new BadRequestException(error.message);
    }
  }
  async registerEmployer(dto: CreateCompanyDto, logoFile: Express.Multer.File) {
    const hashPassword = await this.hashPassword(dto.password);
    const account = await this.accountService.create({
      email: dto.email,
      password: hashPassword,
      role: ROLE_LIST.EMPLOYER,
    });
    if (logoFile) {
      const uploadLogo = await this.uploadService.uploadFile([logoFile]);
      if (uploadLogo && uploadLogo.length > 0) {
        dto.logo = uploadLogo[0].secure_url;
      }
    } else {
      dto.logo = null;
    }

    try {
      const employer = await this.employerService.create(account.id, dto);
      return employer;
    } catch (error: any) {
      await this.accountService.delete(account.id);
      throw new BadRequestException(error.message);
    }
  }
}
