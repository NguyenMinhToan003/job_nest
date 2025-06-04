import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResumeVersionService } from './resume-version.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { CreateResumeVersionDto } from './dto/create-resume-version.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('resume-version')
export class ResumeVersionController {
  constructor(private readonly resumeVersionService: ResumeVersionService) {}

  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(ROLE_LIST.CANDIDATE)
  @Post('init')
  init(
    @Req() req,
    @Body() dto: CreateResumeVersionDto,
    @UploadedFile()
    avatar: Express.Multer.File,
  ) {
    const candidateId = req.user.id;
    return this.resumeVersionService.init(candidateId, dto, avatar);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('me')
  getMe(@Req() req) {
    const candidateId = req.user.id;
    return this.resumeVersionService.getMe(+candidateId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get(':resumeId')
  getOne(@Req() req, @Param('resumeId') resumeId: number) {
    const candidateId = req.user.id;
    return this.resumeVersionService.getOne(candidateId, resumeId);
  }
}
