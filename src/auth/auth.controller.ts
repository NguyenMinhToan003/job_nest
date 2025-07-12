import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/dto';
import { Public } from 'src/decorators/customize';
import { GoogleOAuthGuard } from './passport/google-oauth.guard';
import { CreateUserDto } from 'src/modules/candidate/dto/create-candidate.dto';
import { CreateCompanyDto } from 'src/modules/employer/dto/create-employer.dto';
import { ROLE_LIST } from 'src/types/enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Res() res, @Body() dto: AuthDto) {
    return this.authService.signIn(res, dto);
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(@Req() req, @Res() res) {
    const role = req.user?.role || ROLE_LIST.CANDIDATE;
    if (!Object.values(ROLE_LIST).includes(role)) {
      throw new Error('Vai trò không hợp lệ');
    }
    return this.authService.loginGoogle(req, res, role);
  }

  @Public()
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('register/candidate')
  async registerCandidate(
    @Body() dto: CreateUserDto,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return this.authService.registerCandidate(dto, avatarFile);
  }
  @Public()
  @UseInterceptors(FileInterceptor('logo'))
  @Post('register/employer')
  async registerEmployer(
    @Body() dto: CreateCompanyDto,
    @UploadedFile() logoFile: Express.Multer.File,
  ) {
    if (!logoFile) {
      throw new BadRequestException('Hãy tải lên logo doanh nghiệp');
    }
    return this.authService.registerEmployer(dto, logoFile);
  }
}
